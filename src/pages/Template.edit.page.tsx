import { Button } from "@root/components/__shared/Button"
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
import type { Exercise, IDType, TemplatePlanMovement } from "@root/types/data"
import { useEffect, useMemo, useState } from "react"
import { MdAdd, MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import styled from "styled-components"

// Draft rows keep a client key so reordering/removing doesn't mix up inputs
type DraftSet = { key: number; reps: string; weight: string }
type DraftMovement = { key: number; exerciseId: string; sets: DraftSet[] }

let nextKey = 1
const newSet = (reps = "", weight = ""): DraftSet => ({ key: nextKey++, reps, weight })
const newMovement = (): DraftMovement => ({ key: nextKey++, exerciseId: "", sets: [newSet()] })

const toNumber = (value: string) => (value.trim() === "" || Number.isNaN(Number(value)) ? null : Number(value))

// /templates/new?type=<id> builds a template from scratch; /templates/:id edits one
const TemplateEditPage = () => {
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
  const [saving, setSaving] = useState(false)

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
        sets: movement.sets.map(set => newSet(set.reps?.toString() ?? "", set.weight?.toString() ?? ""))
      }))
    )
    setLoaded(true)
  }, [id, isNew, loaded, templates])

  const selectedType = types.find(type => `${type.id}` === `${typeId}`)

  // Exercises for this workout's categories first, then the rest, each group alphabetical
  const groups = useMemo(() => {
    const order = [...(selectedType?.categories ?? [])]
    const byCategory = new Map<string, Exercise[]>()
    for (const exercise of exercises) {
      const key = exercise.category ?? "other"
      byCategory.set(key, [...(byCategory.get(key) ?? []), exercise])
    }
    const keys = [...byCategory.keys()].sort((a, b) => {
      const rank = (key: string) => (order.includes(key) ? order.indexOf(key) : order.length + (key === "other" ? 1 : 0))
      return rank(a) - rank(b) || a.localeCompare(b)
    })
    return keys.map(key => ({
      key,
      items: (byCategory.get(key) ?? []).sort((a, b) => a.name.localeCompare(b.name))
    }))
  }, [exercises, selectedType])

  const patchMovement = (key: number, patch: Partial<DraftMovement>) =>
    setMovements(list => list.map(item => (item.key === key ? { ...item, ...patch } : item)))

  const patchSet = (movementKey: number, setKey: number, patch: Partial<DraftSet>) =>
    setMovements(list =>
      list.map(item =>
        item.key === movementKey
          ? { ...item, sets: item.sets.map(set => (set.key === setKey ? { ...set, ...patch } : set)) }
          : item
      )
    )

  const moveMovement = (index: number, direction: -1 | 1) =>
    setMovements(list => {
      const target = index + direction
      if (target < 0 || target >= list.length) return list
      const next = [...list]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  const complete = movements.length > 0 && movements.every(movement => movement.exerciseId && movement.sets.length)
  const canSave = name.trim() !== "" && typeId !== null && complete && !saving

  const onSave = async () => {
    if (!canSave || typeId === null) return
    const plan: TemplatePlanMovement[] = movements.map(movement => ({
      exerciseId: Number(movement.exerciseId),
      sets: movement.sets.map(set => ({ reps: toNumber(set.reps), weight: toNumber(set.weight) }))
    }))

    setSaving(true)
    try {
      if (isNew) {
        await dispatch(
          createTemplateFromScratchAction({ name: name.trim(), routineTypeId: typeId, movements: plan })
        ).unwrap()
      } else {
        await dispatch(
          updateTemplateAction({
            templateId: id as string,
            payload: { name: name.trim(), routineTypeId: typeId, movements: plan }
          })
        ).unwrap()
      }
      navigate(-1)
    } catch {
      // the global toast already reports the failure
      setSaving(false)
    }
  }

  return (
    <Page headerComponent={<PageHeader title={isNew ? "New template" : "Edit template"} />}>
      <Form onSubmit={event => event.preventDefault()}>
        {!loaded ? (
          <Hint>Loading template...</Hint>
        ) : (
          <>
            <Field>
              <Label htmlFor="template-name">Name</Label>
              <input
                id="template-name"
                type="text"
                maxLength={100}
                placeholder="e.g. Heavy pull"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </Field>

            <Field>
              <Label htmlFor="template-type">Workout type</Label>
              <Select id="template-type" value={typeId ?? ""} onChange={event => setTypeId(event.target.value || null)}>
                <option value="">Choose a type</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label>Exercises</Label>
              {movements.map((movement, index) => (
                <Card key={movement.key}>
                  <CardHeader>
                    <Select
                      aria-label={`Exercise ${index + 1}`}
                      value={movement.exerciseId}
                      onChange={event => patchMovement(movement.key, { exerciseId: event.target.value })}
                    >
                      <option value="">Choose an exercise</option>
                      {groups.map(group => (
                        <optgroup key={group.key} label={group.key}>
                          {group.items.map(exercise => (
                            <option key={exercise.id} value={exercise.id}>
                              {exercise.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                    <Icon type="button" aria-label="Move up" disabled={index === 0} onClick={() => moveMovement(index, -1)}>
                      <MdKeyboardArrowUp />
                    </Icon>
                    <Icon
                      type="button"
                      aria-label="Move down"
                      disabled={index === movements.length - 1}
                      onClick={() => moveMovement(index, 1)}
                    >
                      <MdKeyboardArrowDown />
                    </Icon>
                    <Icon
                      type="button"
                      aria-label="Remove exercise"
                      onClick={() => setMovements(list => list.filter(item => item.key !== movement.key))}
                    >
                      <MdClose />
                    </Icon>
                  </CardHeader>

                  {movement.sets.map((set, setIndex) => (
                    <SetLine key={set.key}>
                      <span>Set {setIndex + 1}</span>
                      <input
                        aria-label={`Set ${setIndex + 1} reps`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="reps"
                        value={set.reps}
                        onChange={event => patchSet(movement.key, set.key, { reps: event.target.value })}
                      />
                      <span>×</span>
                      <input
                        aria-label={`Set ${setIndex + 1} weight`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        placeholder="kg"
                        value={set.weight}
                        onChange={event => patchSet(movement.key, set.key, { weight: event.target.value })}
                      />
                      <Icon
                        type="button"
                        aria-label={`Remove set ${setIndex + 1}`}
                        onClick={() =>
                          patchMovement(movement.key, { sets: movement.sets.filter(item => item.key !== set.key) })
                        }
                      >
                        <MdClose />
                      </Icon>
                    </SetLine>
                  ))}
                  <TextButton
                    type="button"
                    onClick={() => {
                      const last = movement.sets[movement.sets.length - 1]
                      patchMovement(movement.key, { sets: [...movement.sets, newSet(last?.reps, last?.weight)] })
                    }}
                  >
                    <MdAdd /> Add set
                  </TextButton>
                </Card>
              ))}
              <TextButton type="button" onClick={() => setMovements(list => [...list, newMovement()])}>
                <MdAdd /> Add exercise
              </TextButton>
            </Field>

            <Button
              type="button"
              label="Save template"
              loadingText="Saving..."
              isLoading={saving}
              disabled={!canSave}
              onClick={onSave}
            />
            <Cancel type="button" onClick={() => navigate(-1)}>
              Cancel
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

const SetLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-3);
  font-size: 0.8rem;

  span:first-child {
    width: 3.2rem;
  }

  input {
    width: 5rem;
  }
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
