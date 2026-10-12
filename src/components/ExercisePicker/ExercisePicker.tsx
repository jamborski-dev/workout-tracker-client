import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { toggleFavouriteLocal } from "@root/store/slices/exercises/exercises.slice"
import { createExerciseAction, updateExerciseAction } from "@root/store/slices/exercises/exercises.thunks"
import type { Exercise, IDType } from "@root/types/data"
import { AnimatePresence, motion } from "motion/react"
import { type FC, useMemo, useRef, useState } from "react"
import { IoStar, IoStarOutline } from "react-icons/io5"
import { MdAdd, MdChevronRight, MdKeyboardArrowDown, MdArrowBack } from "react-icons/md"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import i18n, { enumLabel, muscleLabel } from "@root/i18n"

type GroupBy = "category" | "muscle" | "equipment"

const GROUP_LABELS: Record<GroupBy, string> = {
  category: "picker.groupType",
  muscle: "picker.groupMuscle",
  equipment: "picker.groupEquipment"
}

const MUSCLES: Record<string, string> = {
  Chest: "push",
  Shoulders: "push",
  Triceps: "push",
  Back: "pull",
  Biceps: "pull",
  Quadriceps: "legs",
  Hamstrings: "legs",
  Glutes: "legs",
  Calves: "legs",
  Core: "core"
}
const EQUIPMENT = ["barbell", "dumbbell", "cable", "machine", "bodyweight"]

const title = (value?: string | null) =>
  value
    ? value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ")
    : ""

// Group keys stay English (they match library data); only the displayed label is localised
const groupLabel = (label: string, by: GroupBy) => {
  if (label === "Other") return i18n.t("picker.other")
  if (by === "category") return enumLabel("category", label)
  if (by === "equipment") return enumLabel("equipment", label)
  return muscleLabel(label)
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

const groupKey = (exercise: Exercise, by: GroupBy) => {
  if (by === "category") return title(exercise.category) || "Other"
  if (by === "equipment") return title(exercise.equipment) || "Other"
  return title((exercise.muscleGroup ?? "").split(",")[0].trim()) || "Other"
}

const meta = (exercise: Exercise) =>
  [enumLabel("equipment", exercise.equipment), muscleLabel(exercise.muscleGroup)].filter(Boolean).join(" • ")

// Name and aliases, forgiving about case, punctuation and word order
const score = (exercise: Exercise, query: string) => {
  const name = normalize(exercise.name)
  if (name === query) return 100
  if (name.startsWith(query)) return 80
  if (name.includes(query)) return 60
  const haystack = [name, ...(exercise.aliases ?? []).map(normalize)]
  if (haystack.some(text => text.includes(query))) return 40
  const tokens = query.split(" ")
  if (tokens.every(token => haystack.some(text => text.includes(token)))) return 20
  return 0
}

interface ExercisePickerProps {
  exerciseId?: IDType | null
  // Exercise categories that suit today's workout, most relevant first
  preferredCategories?: string[]
  onSelect: (exerciseId: IDType) => void
  placeholder?: string
}

export const ExercisePicker: FC<ExercisePickerProps> = ({
  exerciseId,
  preferredCategories = [],
  onSelect,
  placeholder
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const exercises = useAppSelector(state => state.exercises.list)
  const selected = exercises.find(exercise => exercise.id === exerciseId)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [groupBy, setGroupBy] = useState<GroupBy>("category")
  const [group, setGroup] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: "", muscle: "Chest", equipment: "barbell" })
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const normalizedQuery = normalize(query)
  const favourites = exercises.filter(exercise => exercise.favourite)

  const close = () => {
    setOpen(false)
    setQuery("")
    setGroup(null)
    setAdding(false)
  }

  const choose = (exercise: Exercise) => {
    onSelect(exercise.id)
    close()
  }

  const toggleFavourite = async (exercise: Exercise) => {
    dispatch(toggleFavouriteLocal(exercise.id))
    try {
      await dispatch(
        updateExerciseAction({ exerciseId: exercise.id, payload: { favourite: !exercise.favourite } })
      ).unwrap()
    } catch {
      dispatch(toggleFavouriteLocal(exercise.id))
    }
  }

  const groups = useMemo(() => {
    const map = new Map<string, Exercise[]>()
    for (const exercise of exercises) {
      const key = groupKey(exercise, groupBy)
      map.set(key, [...(map.get(key) ?? []), exercise])
    }
    const rank = (label: string) => {
      if (label === "Other") return 1000
      const index = preferredCategories.indexOf(label.toLowerCase())
      return groupBy === "category" && index !== -1 ? index : 100
    }
    return [...map.entries()]
      .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
      .map(([label, items]) => ({ label, items: items.sort((a, b) => a.name.localeCompare(b.name)) }))
  }, [exercises, groupBy, preferredCategories])

  const results = useMemo(() => {
    if (!normalizedQuery) return []
    return exercises
      .map(exercise => ({ exercise, points: score(exercise, normalizedQuery) }))
      .filter(item => item.points > 0)
      .sort((a, b) => b.points - a.points || a.exercise.name.localeCompare(b.exercise.name))
      .map(item => item.exercise)
  }, [exercises, normalizedQuery])

  const listFor = (label: string): Exercise[] => {
    if (label === "__favourites") return favourites
    if (label === "__all") return [...exercises].sort((a, b) => a.name.localeCompare(b.name))
    return groups.find(item => item.label === label)?.items ?? []
  }

  const startAdding = () => {
    setDraft({ name: query.trim(), muscle: "Chest", equipment: "barbell" })
    setAdding(true)
  }

  const createExercise = async () => {
    const name = draft.name.trim()
    if (!name) return
    setSaving(true)
    try {
      const created = await dispatch(
        createExerciseAction({
          name,
          description: "",
          muscleGroup: draft.muscle,
          category: MUSCLES[draft.muscle],
          equipment: draft.equipment
        })
      ).unwrap()
      onSelect(created.id)
      close()
    } catch {
      // the global toast reports the failure
    } finally {
      setSaving(false)
    }
  }

  const row = (exercise: Exercise) => (
    <Row key={exercise.id} type="button" onClick={() => choose(exercise)}>
      <span className="text">
        <span className="name">{exercise.name}</span>
        <span className="meta">{meta(exercise)}</span>
      </span>
      <Star
        role="button"
        aria-label={exercise.favourite ? t("picker.removeFavourite") : t("picker.addFavourite")}
        data-on={Boolean(exercise.favourite)}
        onClick={event => {
          event.stopPropagation()
          toggleFavourite(exercise)
        }}
      >
        {exercise.favourite ? <IoStar /> : <IoStarOutline />}
      </Star>
    </Row>
  )

  const view = adding ? "add" : normalizedQuery ? "search" : (group ?? "root")

  if (!open) {
    return (
      <Trigger
        type="button"
        onClick={() => {
          setOpen(true)
          requestAnimationFrame(() => inputRef.current?.focus())
        }}
      >
        <span data-empty={!selected}>{selected?.name ?? placeholder ?? t("picker.choose")}</span>
        <MdKeyboardArrowDown />
      </Trigger>
    )
  }

  return (
    <Shell>
      <SearchRow>
        {(group || adding) && !normalizedQuery ? (
          <Back
            type="button"
            aria-label={t("picker.back")}
            onClick={() => {
              if (adding) setAdding(false)
              else setGroup(null)
            }}
          >
            <MdArrowBack />
          </Back>
        ) : null}
        <input
          ref={inputRef}
          autoFocus
          type="text"
          inputMode="search"
          placeholder={t("picker.search")}
          value={query}
          onChange={event => {
            setQuery(event.target.value)
            setAdding(false)
          }}
          onKeyDown={event => event.key === "Escape" && close()}
        />
        <Cancel type="button" onClick={close}>
          {t("picker.cancel")}
        </Cancel>
      </SearchRow>

      <Panel>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, x: group ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {view === "add" && (
              <AddForm>
                <label>
                  {t("picker.name")}
                  <input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} maxLength={80} />
                </label>
                <label>
                  {t("picker.muscle")}
                  <select value={draft.muscle} onChange={event => setDraft({ ...draft, muscle: event.target.value })}>
                    {Object.keys(MUSCLES).map(muscle => (
                      <option key={muscle} value={muscle}>
                        {muscleLabel(muscle)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("picker.equipment")}
                  <select value={draft.equipment} onChange={event => setDraft({ ...draft, equipment: event.target.value })}>
                    {EQUIPMENT.map(item => (
                      <option key={item} value={item}>
                        {enumLabel("equipment", item)}
                      </option>
                    ))}
                  </select>
                </label>
                <Primary type="button" disabled={!draft.name.trim() || saving} onClick={createExercise}>
                  {saving ? t("picker.adding") : t("picker.addExercise")}
                </Primary>
                <Hint>{t("picker.privateHint")}</Hint>
              </AddForm>
            )}

            {view === "search" && (
              <>
                {results.map(row)}
                {!results.some(item => normalize(item.name) === normalizedQuery) && (
                  <Row type="button" onClick={startAdding}>
                    <span className="text">
                      <span className="name accent">
                        <MdAdd /> {t("picker.add", { name: query.trim() })}
                      </span>
                      <span className="meta">{results.length ? t("picker.notFound") : t("picker.noMatch")}</span>
                    </span>
                  </Row>
                )}
              </>
            )}

            {view === "root" && (
              <>
                <Chips>
                  {(Object.keys(GROUP_LABELS) as GroupBy[]).map(option => (
                    <Chip key={option} type="button" data-on={groupBy === option} onClick={() => setGroupBy(option)}>
                      {t(GROUP_LABELS[option])}
                    </Chip>
                  ))}
                </Chips>
                {favourites.length > 0 && (
                  <Row type="button" onClick={() => setGroup("__favourites")}>
                    <span className="text">
                      <span className="name">{t("picker.favourites")}</span>
                    </span>
                    <Count>
                      {favourites.length} <MdChevronRight />
                    </Count>
                  </Row>
                )}
                {groups.map(item => (
                  <Row key={item.label} type="button" onClick={() => setGroup(item.label)}>
                    <span className="text">
                      <span className="name">
                        {groupLabel(item.label, groupBy)}
                        {groupBy === "category" && preferredCategories.includes(item.label.toLowerCase()) && (
                          <Tag>{t("picker.forWorkout")}</Tag>
                        )}
                      </span>
                    </span>
                    <Count>
                      {item.items.length} <MdChevronRight />
                    </Count>
                  </Row>
                ))}
                <Row type="button" onClick={() => setGroup("__all")}>
                  <span className="text">
                    <span className="name">{t("picker.all")}</span>
                  </span>
                  <Count>
                    {exercises.length} <MdChevronRight />
                  </Count>
                </Row>
              </>
            )}

            {view !== "root" && view !== "search" && view !== "add" && listFor(view).map(row)}
          </motion.div>
        </AnimatePresence>
      </Panel>
    </Shell>
  )
}

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
  padding: 0.55rem 0.6rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: var(--surface);
  color: var(--text-1);
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span[data-empty="true"] {
    color: var(--text-3);
  }

  svg {
    flex-shrink: 0;
    color: var(--text-3);
    font-size: 1.2rem;
  }
`

const Shell = styled.div`
  width: 100%;
  min-width: 0;
  border: 1px solid var(--accent);
  border-radius: var(--radius-control);
  background: var(--surface);
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.4rem;
  border-bottom: 1px solid var(--border-subtle);

  input {
    flex: 1;
    min-width: 0;
    padding: 0.3rem 0.2rem;
    border: 0;
    background: transparent;
    color: var(--text-1);
    font-size: 0.9rem;
    outline: none;
  }
`

const Back = styled.button`
  display: inline-flex;
  padding: 0.2rem;
  border: 0;
  background: transparent;
  color: var(--text-2);
  font-size: 1.2rem;
  cursor: pointer;
`

const Cancel = styled.button`
  border: 0;
  background: transparent;
  color: var(--text-3);
  font-size: 0.8rem;
  cursor: pointer;
`

const Panel = styled.div`
  max-height: 20rem;
  overflow-y: auto;
  overscroll-behavior: contain;
`

const Row = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: calc(0.55rem * var(--density, 1)) 0.75rem;
  border: 0;
  border-bottom: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-2);
  text-align: left;
  cursor: pointer;

  &:hover {
    background: var(--accent-soft);
    color: var(--text-1);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .name {
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .name.accent {
    color: var(--accent-text);
  }

  .meta {
    font-size: 0.65rem;
    color: var(--text-3);
  }
`

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--text-3);
`

const Star = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  padding: 0.1rem;
  color: var(--text-3);
  font-size: 1.1rem;

  &[data-on="true"] {
    color: var(--warning);
  }
`

const Tag = styled.small`
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--accent-text);
`

const Chips = styled.div`
  display: flex;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
`

const Chip = styled.button`
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--text-2);
  font-size: 0.7rem;
  cursor: pointer;

  &[data-on="true"] {
    border-color: var(--accent);
    background: var(--accent-soft);
    color: var(--text-1);
  }
`

const AddForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.75rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.7rem;
    color: var(--text-3);
  }

  input,
  select {
    padding: 0.45rem 0.5rem;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-control);
    background: var(--surface);
    color: var(--text-1);
    font-size: 0.85rem;
  }
`

const Primary = styled.button`
  padding: 0.5rem;
  border: 0;
  border-radius: var(--radius-control);
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const Hint = styled.small`
  color: var(--text-3);
  font-size: 0.65rem;
`
