import { Button } from "@root/components/__shared/Button"
import { Page } from "@root/components/__shared/layout/Page"
import { PageHeader } from "@root/components/__shared/PageHeader"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectList } from "@root/store/slices/routines/routines.selectors"
import {
  getAllRoutinesAction,
  initRoutineAction
} from "@root/store/slices/routines/routines.thunks"
import { selectRoutineTypes } from "@root/store/slices/routineTypes/routineTypes.selectors"
import { getAllRoutineTypesAction } from "@root/store/slices/routineTypes/routineTypes.thunks"
import { selectTemplates } from "@root/store/slices/templates/templates.selectors"
import {
  deleteTemplateAction,
  getAllTemplatesAction
} from "@root/store/slices/templates/templates.thunks"
import type { IDType, Routine, RoutineTemplate, RoutineType } from "@root/types/data"
import { format } from "date-fns"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

// "PPL: Push" belongs to the "PPL" family; the next workout in a rotation is the next type in it
const family = (name: string) => name.split(":")[0].trim()

const suggestNextType = (types: RoutineType[], routines: Routine[]): RoutineType | undefined => {
  if (!types.length) return undefined

  const latest = [...routines].sort(
    (a, b) => +new Date((b as { date?: string }).date ?? 0) - +new Date((a as { date?: string }).date ?? 0)
  )[0]
  const lastType = latest && types.find(type => `${type.id}` === `${latest.routineTypeId}`)
  if (!lastType) return types[0]

  const siblings = types.filter(type => family(type.name) === family(lastType.name))
  const index = siblings.findIndex(type => type.id === lastType.id)
  return siblings[(index + 1) % siblings.length] ?? lastType
}

const RoutineNewPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const types = useAppSelector(selectRoutineTypes)
  const routines = useAppSelector(selectList)
  const templates = useAppSelector(selectTemplates)

  const [typeId, setTypeId] = useState<IDType | null>(null)
  const [templateId, setTemplateId] = useState<IDType | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<IDType | null>(null)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [saving, setSaving] = useState(false)
  const userChoseType = useRef(false)

  useEffect(() => {
    dispatch(getAllRoutineTypesAction())
    dispatch(getAllRoutinesAction())
    dispatch(getAllTemplatesAction())
  }, [dispatch])

  const suggested = useMemo(() => suggestNextType(types, routines), [types, routines])

  // Preselect the next workout in the rotation until the user picks one themselves
  useEffect(() => {
    if (suggested && !userChoseType.current) setTypeId(suggested.id)
  }, [suggested])

  const selectedType = types.find(type => type.id === typeId)
  const typeTemplates = templates.filter(template => template.routineTypeId === typeId)
  const selectedTemplate = typeTemplates.find(template => template.id === templateId)

  const pickType = (id: IDType) => {
    userChoseType.current = true
    setTypeId(id)
    // A template belongs to one workout type
    if (templates.find(template => template.id === templateId)?.routineTypeId !== id) setTemplateId(null)
  }

  const pickTemplate = (template: RoutineTemplate) => {
    userChoseType.current = true
    setTypeId(template.routineTypeId)
    setTemplateId(template.id)
  }

  const removeTemplate = async (id: IDType) => {
    try {
      await dispatch(deleteTemplateAction({ templateId: id })).unwrap()
      if (templateId === id) setTemplateId(null)
    } catch {
      // the global toast already reports the failure
    }
    setConfirmDeleteId(null)
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedType) return

    setSaving(true)
    try {
      const { id } = await dispatch(
        initRoutineAction({
          routineTypeId: selectedType.id,
          ...(selectedTemplate && { templateId: selectedTemplate.id }),
          name: title.trim() || selectedType.name,
          // Noon local time keeps the calendar day stable across timezones
          date: new Date(`${date}T12:00:00`).toISOString()
        })
      ).unwrap()
      navigate(`/routines/${id}`)
    } catch {
      // the global toast already reports the failure
      setSaving(false)
    }
  }

  return (
    <Page headerComponent={<PageHeader title="New routine" />}>
      <Form onSubmit={onSubmit}>
        <Field>
          <Label>Workout type</Label>
          <Hint>Orders the exercise list so the exercises for today come first.</Hint>
          <Types>
            {types.map(type => (
              <TypeButton
                key={type.id}
                type="button"
                aria-pressed={type.id === typeId}
                onClick={() => pickType(type.id)}
              >
                <strong>{type.name}</strong>
                <small>
                  {type.id === suggested?.id ? "Next in your rotation" : (type.categories ?? []).join(", ")}
                </small>
              </TypeButton>
            ))}
          </Types>
        </Field>

        <Field>
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            type="text"
            maxLength={100}
            placeholder={selectedType?.name ?? "Routine title"}
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </Field>

        <Field>
          <Label htmlFor="date">Date</Label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={event => setDate(event.target.value)}
          />
        </Field>

        <Field>
          <Label>Template</Label>
          <Hint>
            {typeTemplates.length
              ? "Start from a saved plan; its exercises and planned sets are copied into the new routine."
              : `No templates for ${selectedType?.name ?? "this workout"} yet. Create one here, or open a routine and use "Save as template".`}
          </Hint>
          {typeTemplates.length > 0 && (
            <Templates>
              <TemplateTile
                type="button"
                aria-pressed={!selectedTemplate}
                onClick={() => setTemplateId(null)}
              >
                <strong>Start empty</strong>
                <small>Add exercises as you go</small>
              </TemplateTile>
              {typeTemplates.map(template => {
                const sets = template.movements.reduce((sum, movement) => sum + movement.sets.length, 0)
                return (
                  <TemplateRow key={template.id}>
                    <TemplateTile
                      type="button"
                      aria-pressed={template.id === templateId}
                      onClick={() => pickTemplate(template)}
                    >
                      <strong>{template.name}</strong>
                      <small>
                        {template.movements.length} exercise{template.movements.length === 1 ? "" : "s"} ·{" "}
                        {sets} set{sets === 1 ? "" : "s"}
                      </small>
                      <small>
                        {template.movements.map(movement => movement.exercise?.name).filter(Boolean).join(", ")}
                      </small>
                    </TemplateTile>
                    <Remove
                      type="button"
                      aria-label={`Edit template ${template.name}`}
                      onClick={() => navigate(`/templates/${template.id}`)}
                    >
                      Edit
                    </Remove>
                    {confirmDeleteId === template.id ? (
                      <Remove type="button" $danger onClick={() => removeTemplate(template.id)}>
                        Confirm
                      </Remove>
                    ) : (
                      <Remove
                        type="button"
                        aria-label={`Delete template ${template.name}`}
                        onClick={() => setConfirmDeleteId(template.id)}
                      >
                        Delete
                      </Remove>
                    )}
                  </TemplateRow>
                )
              })}
            </Templates>
          )}
          <NewTemplate type="button" onClick={() => navigate(`/templates/new?type=${typeId ?? ""}`)}>
            + New template
          </NewTemplate>
        </Field>

        <Button
          type="submit"
          label="Start routine"
          loadingText="Creating..."
          isLoading={saving}
          disabled={!selectedType || saving}
        />
        <Cancel type="button" onClick={() => navigate("/routines")}>
          Cancel
        </Cancel>
      </Form>
    </Page>
  )
}

export default RoutineNewPage

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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

const Types = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`

const TypeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  padding: 0.7rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  background: var(--surface);
  color: var(--text-1);
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;

  small {
    color: var(--text-3);
    font-size: 0.7rem;
  }

  &[aria-pressed="true"] {
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  &[aria-pressed="true"] small {
    color: var(--accent-text);
  }
`

const Templates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TemplateRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.5rem;

  > button:first-child {
    flex: 1;
    min-width: 0;
  }
`

const TemplateTile = styled(TypeButton)`
  width: 100%;

  small {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const NewTemplate = styled.button`
  align-self: flex-start;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--accent-text);
  font-size: 0.85rem;
  cursor: pointer;
`

const Remove = styled.button<{ $danger?: boolean }>`
  padding: 0 0.8rem;
  border: 1px solid ${({ $danger }) => ($danger ? "var(--danger)" : "var(--border-default)")};
  border-radius: var(--radius-card);
  background: transparent;
  color: ${({ $danger }) => ($danger ? "var(--danger)" : "var(--text-3)")};
  font-size: 0.8rem;
  cursor: pointer;
`

const Cancel = styled.button`
  border: none;
  background: transparent;
  color: var(--text-3);
  font-size: 0.9rem;
  cursor: pointer;
`
