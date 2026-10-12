import { Page } from "@root/components/__shared/layout/Page"
import { PageHeader } from "@root/components/__shared/PageHeader"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { getAllExercisesAction } from "@root/store/slices/exercises/exercises.thunks"
import { selectRoutineTypes } from "@root/store/slices/routineTypes/routineTypes.selectors"
import { getAllRoutineTypesAction } from "@root/store/slices/routineTypes/routineTypes.thunks"
import { selectTemplates } from "@root/store/slices/templates/templates.selectors"
import {
  createTemplateFromScratchAction,
  getAllTemplatesAction,
  updateTemplateAction
} from "@root/store/slices/templates/templates.thunks"
import type { IDType, TemplatePlanMovement } from "@root/types/data"
import { useEffect, useRef, useState } from "react"
import { MdAdd, MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { ExercisePicker } from "@root/components/ExercisePicker/ExercisePicker"
import { SetupField } from "@root/components/ExercisePicker/SetupField"
import { GridButton, SetGrid } from "@root/components/SetGrid/SetGrid"
import type { GridSet } from "@root/components/SetGrid/types"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import i18n from "@root/i18n"

// Draft rows keep a client key so reordering/removing doesn't mix up inputs
type DraftSet = { key: number; reps: number | null; weight: number | null; isWarmup: boolean }
type DraftMovement = { key: number; exerciseId: string; setup: string; sets: DraftSet[] }

let nextKey = 1
const newSet = (reps: number | null = null, weight: number | null = null, isWarmup = false): DraftSet => ({
  key: nextKey++,
  reps,
  weight,
  isWarmup
})
const newMovement = (): DraftMovement => ({ key: nextKey++, exerciseId: "", setup: "", sets: [newSet()] })

const toGridSet = (set: DraftSet): GridSet => ({
  id: set.key,
  plannedReps: set.reps,
  plannedWeight: set.weight,
  isWarmup: set.isWarmup
})

// /templates/new?type=<id> builds a template from scratch; /templates/:id edits one
const statusLabel = (status: string, dirty: boolean, canSave: boolean) => {
  if (status === "saving") return i18n.t("tpl.saving")
  if (dirty) return canSave ? i18n.t("tpl.unsaved") : i18n.t("tpl.needMore")
  return status === "saved" ? i18n.t("tpl.saved") : undefined
}

const TemplateEditPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [search] = useSearchParams()
  const isNew = id === "new"

  const types = useAppSelector(selectRoutineTypes)
  const templates = useAppSelector(selectTemplates)
  const exercises = useAppSelector(state => state.exercises.list)

  const [name, setName] = useState("")
  const [typeId, setTypeId] = useState<IDType | null>(isNew ? (search.get("type") ?? null) : null)
  const [movements, setMovements] = useState<DraftMovement[]>(isNew ? [newMovement()] : [])
  const [loaded, setLoaded] = useState(isNew)
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [dirty, setDirty] = useState(false)
  const saveInFlight = useRef(false)

  useEffect(() => {
    dispatch(getAllRoutineTypesAction())
    dispatch(getAllExercisesAction())
    dispatch(getAllTemplatesAction())
  }, [dispatch])

  // Fill the draft once from the stored template
  useEffect(() => {
    if (isNew || loaded) return
    const template = templates.find(item => `${item.id}` === id)
    if (!template) return
    setName(template.name)
    setTypeId(template.routineTypeId)
    setMovements(
      template.movements.map(movement => ({
        key: nextKey++,
        exerciseId: `${movement.exerciseId}`,
        setup: movement.setup ?? "",
        sets: movement.sets.map(set => newSet(set.reps ?? null, set.weight ?? null, Boolean(set.isWarmup)))
      }))
    )
    setLoaded(true)
  }, [id, isNew, loaded, templates])

  const selectedType = types.find(type => `${type.id}` === `${typeId}`)

  const patchMovement = (key: number, patch: Partial<DraftMovement>) => {
    setDirty(true)
    setMovements(list => list.map(item => (item.key === key ? { ...item, ...patch } : item)))
  }

  const patchSet = (movementKey: number, setKey: number, patch: Partial<DraftSet>) => {
    setDirty(true)
    setMovements(list =>
      list.map(item =>
        item.key === movementKey
          ? { ...item, sets: item.sets.map(set => (set.key === setKey ? { ...set, ...patch } : set)) }
          : item
      )
    )
  }

  const moveMovement = (index: number, direction: -1 | 1) => {
    setDirty(true)
    setMovements(list => {
      const target = index + direction
      if (target < 0 || target >= list.length) return list
      const next = [...list]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const complete = movements.length > 0 && movements.every(movement => movement.exerciseId && movement.sets.length)
  const canSave = name.trim() !== "" && typeId !== null && complete

  const plan = (): TemplatePlanMovement[] =>
    movements.map(movement => ({
      exerciseId: Number(movement.exerciseId),
      setup: movement.setup.trim() || null,
      sets: movement.sets.map(set => ({ reps: set.reps, weight: set.weight, isWarmup: set.isWarmup }))
    }))

  // Autosave once the draft is valid and has stopped changing; a new template is created on the
  // first save and the page then continues as an edit of it.
  useEffect(() => {
    if (!loaded || !dirty || !canSave || typeId === null || saveInFlight.current) return
    const timeout = window.setTimeout(async () => {
      saveInFlight.current = true
      setStatus("saving")
      try {
        if (isNew) {
          const created = await dispatch(
            createTemplateFromScratchAction({ name: name.trim(), routineTypeId: typeId, movements: plan() })
          ).unwrap()
          setDirty(false)
          setStatus("saved")
          navigate(`/templates/${created.id}`, { replace: true })
        } else {
          await dispatch(
            updateTemplateAction({
              templateId: id as string,
              payload: { name: name.trim(), routineTypeId: typeId, movements: plan() }
            })
          ).unwrap()
          setDirty(false)
          setStatus("saved")
        }
      } catch {
        // the global toast already reports the failure
        setStatus("idle")
      } finally {
        saveInFlight.current = false
      }
    }, 1500)
    return () => window.clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, typeId, movements, dirty, loaded])

  return (
    <Page headerComponent={<PageHeader title={isNew ? t("tpl.newTitle") : t("tpl.editTitle")} brew={statusLabel(status, dirty, canSave)} />}>
      <Form onSubmit={event => event.preventDefault()}>
        {!loaded ? (
          <Hint>{t("tpl.loading")}</Hint>
        ) : (
          <>
            <Field>
              <Label htmlFor="template-name">{t("tpl.name")}</Label>
              <input
                id="template-name"
                type="text"
                maxLength={100}
                placeholder={t("tpl.namePlaceholder")}
                value={name}
                onChange={event => {
                  setDirty(true)
                  setName(event.target.value)
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="template-type">{t("tpl.type")}</Label>
              <Select id="template-type" value={typeId ?? ""} onChange={event => {
                  setDirty(true)
                  setTypeId(event.target.value || null)
                }}>
                <option value="">{t("tpl.chooseType")}</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label>{t("tpl.exercises")}</Label>
              {movements.map((movement, index) => (
                <Card key={movement.key}>
                  <CardHeader>
                    <ExercisePicker
                      exerciseId={movement.exerciseId ? Number(movement.exerciseId) : null}
                      preferredCategories={selectedType?.categories ?? []}
                      onSelect={exerciseId => patchMovement(movement.key, { exerciseId: `${exerciseId}` })}
                    />
                    <Icon type="button" aria-label={t("tpl.moveUp")} disabled={index === 0} onClick={() => moveMovement(index, -1)}>
                      <MdKeyboardArrowUp />
                    </Icon>
                    <Icon
                      type="button"
                      aria-label={t("tpl.moveDown")}
                      disabled={index === movements.length - 1}
                      onClick={() => moveMovement(index, 1)}
                    >
                      <MdKeyboardArrowDown />
                    </Icon>
                    <Icon
                      type="button"
                      aria-label={t("tpl.removeExercise")}
                      onClick={() => {
                        setDirty(true)
                        setMovements(list => list.filter(item => item.key !== movement.key))
                      }}
                    >
                      <MdClose />
                    </Icon>
                  </CardHeader>

                  <SetupField value={movement.setup} onChange={setup => patchMovement(movement.key, { setup })} />
                  {movement.sets.length > 0 && (
                    <SetGrid
                      mode="template"
                      weightPerSide={Boolean(exercises.find(item => `${item.id}` === movement.exerciseId)?.weightPerSide)}
                      title={exercises.find(item => `${item.id}` === movement.exerciseId)?.name ?? t("tpl.exerciseN", { n: index + 1 })}
                      sets={movement.sets.map(toGridSet)}
                      onChange={(setId, field, value) =>
                        patchSet(movement.key, Number(setId), {
                          ...(field === "plannedReps" && { reps: value as number | null }),
                          ...(field === "plannedWeight" && { weight: value as number | null }),
                          ...(field === "isWarmup" && { isWarmup: Boolean(value) })
                        })
                      }
                      onDelete={setId =>
                        patchMovement(movement.key, { sets: movement.sets.filter(item => item.key !== Number(setId)) })
                      }
                      onReorder={ids =>
                        patchMovement(movement.key, {
                          sets: ids
                            .map(setId => movement.sets.find(item => item.key === Number(setId)))
                            .filter((item): item is DraftSet => Boolean(item))
                        })
                      }
                    />
                  )}
                  <GridButton
                    type="button"
                    onClick={() => {
                      const last = movement.sets[movement.sets.length - 1]
                      patchMovement(movement.key, { sets: [...movement.sets, newSet(last?.reps, last?.weight)] })
                    }}
                  >
                    <MdAdd /> {t("tpl.addSet")}
                  </GridButton>
                </Card>
              ))}
              <TextButton type="button" onClick={() => setMovements(list => [...list, newMovement()])}>
                <MdAdd /> {t("tpl.addExercise")}
              </TextButton>
            </Field>

            <Cancel type="button" onClick={() => navigate("/routines/new")}>
              {t("tpl.done")}
            </Cancel>
          </>
        )}
      </Form>
    </Page>
  )
}

export default TemplateEditPage

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
`

const Hint = styled.small`
  color: var(--text-3);
`

const Select = styled.select`
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.6rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: var(--surface);
  color: var(--text-1);
  font-size: 0.9rem;

  optgroup {
    text-transform: capitalize;
  }
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  background: var(--surface);
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const Icon = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;

  svg {
    font-size: 1.2rem;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

const TextButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--accent-text);
  font-size: 0.85rem;
  cursor: pointer;
`

const Cancel = styled.button`
  border: none;
  background: transparent;
  color: var(--text-3);
  font-size: 0.9rem;
  cursor: pointer;
`
