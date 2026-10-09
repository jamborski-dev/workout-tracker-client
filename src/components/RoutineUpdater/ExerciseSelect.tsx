import { useEffect, useState } from "react"
import type { FC, Ref } from "react"
import type { GroupBase, OptionProps, SingleValue } from "react-select"
import Select from "react-select"
import type { Exercise, IDType } from "@root/types/data"
import { Controller, useFormContext } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { toggleFavouriteLocal } from "@root/store/slices/exercises/exercises.slice"
import { updateExerciseAction } from "@root/store/slices/exercises/exercises.thunks"
import { exerciseSelectStyles } from "../_forms/CustomSelectStyles"
import styled from "styled-components"
import { IoStar, IoStarOutline } from "react-icons/io5"

type ExerciseGroupBy = "none" | "category" | "complexity"

const GROUP_BY_LABELS: Record<ExerciseGroupBy, string> = {
  none: "All",
  category: "Category",
  complexity: "Complexity"
}

const toSentenceCase = (value?: string | null) => {
  if (!value) {
    return null
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

const getExerciseMeta = (exercise: Exercise) => {
  return [
    toSentenceCase(exercise.complexity),
    exercise.muscleGroup,
    toSentenceCase(exercise.category),
    toSentenceCase(exercise.equipment)
  ]
    .filter(Boolean)
    .join(" • ")
}

const buildExerciseOptions = (
  exercises: Exercise[],
  groupBy: ExerciseGroupBy
): Array<Exercise | GroupBase<Exercise>> => {
  const sortedExercises = [...exercises].sort((left, right) => {
    if (Boolean(left.favourite) !== Boolean(right.favourite)) {
      return left.favourite ? -1 : 1
    }

    const leftName = left.name ?? ""
    const rightName = right.name ?? ""

    return leftName.localeCompare(rightName)
  })

  if (groupBy === "none") {
    return sortedExercises
  }

  const groupedExercises = new Map<string, Exercise[]>()

  for (const exercise of sortedExercises) {
    const rawValue = groupBy === "category" ? exercise.category : exercise.complexity
    const groupLabel = toSentenceCase(rawValue) ?? "Other"
    const existingGroup = groupedExercises.get(groupLabel) ?? []
    existingGroup.push(exercise)
    groupedExercises.set(groupLabel, existingGroup)
  }

  return Array.from(groupedExercises.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, options]) => ({ label, options }))
}

const CustomOption: FC<
  OptionProps<Exercise, false, GroupBase<Exercise>> & {
    onToggleFavourite: (exercise: Exercise) => void
  }
> = props => {
  const { data, innerRef, innerProps, isFocused, isSelected, onToggleFavourite } = props
  const exerciseMeta = getExerciseMeta(data)

  return (
    <div
      ref={innerRef as Ref<HTMLDivElement>}
      {...innerProps}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.5rem 1rem",
        lineHeight: "1.2",
        cursor: "pointer",
        fontWeight: isSelected ? "bold" : "normal",
        backgroundColor: isFocused ? "#e6f7ff" : "transparent",
        color: isFocused ? "#333" : "#616161"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <span style={{ fontSize: "0.8rem" }}>{data.name}</span>
        {exerciseMeta ? (
          <span style={{ fontSize: "0.6rem", color: "#888" }}>{exerciseMeta}</span>
        ) : null}
      </div>
      <FavouriteButton
        type="button"
        aria-label={data.favourite ? "Remove from favourites" : "Add to favourites"}
        onMouseDown={event => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onClick={event => {
          event.preventDefault()
          event.stopPropagation()
          onToggleFavourite(data)
        }}
        $isActive={Boolean(data.favourite)}
      >
        {data.favourite ? <IoStar /> : <IoStarOutline />}
      </FavouriteButton>
    </div>
  )
}

interface ExerciseSelectProps {
  movementId: IDType
  exerciseId?: IDType | null
  onChange: (selected: IDType) => void
}

export const ExerciseSelect: FC<ExerciseSelectProps> = ({ movementId, exerciseId, onChange }) => {
  const dispatch = useAppDispatch()
  const { control, setValue } = useFormContext()
  const exerciseList = useAppSelector(state => state.exercises.list)
  const isLoading = useAppSelector(state => state.exercises.isLoading)
  const [groupBy, setGroupBy] = useState<ExerciseGroupBy>("category")
  const selectMenuPortalTarget = typeof document !== "undefined" ? document.body : null
  const isTouchDevice =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(pointer: coarse)")?.matches || "ontouchstart" in window)
  const selectOptions = buildExerciseOptions(exerciseList, groupBy)

  const handleOnChange = (selected: SingleValue<Exercise>) => {
    if (!selected) return

    onChange(selected.id)
  }

  const handleToggleFavourite = async (exercise: Exercise) => {
    dispatch(toggleFavouriteLocal(exercise.id))

    try {
      await dispatch(
        updateExerciseAction({
          exerciseId: exercise.id,
          payload: { favourite: !exercise.favourite }
        })
      ).unwrap()
    } catch {
      dispatch(toggleFavouriteLocal(exercise.id))
    }
  }

  useEffect(() => {
    if (exerciseId) {
      setValue(`movement.${movementId}.select`, exerciseId)
    }
  }, [exerciseId, setValue, movementId])

  return (
    <SelectShell>
      <Controller
        name={`movement.${movementId}.select`}
        control={control}
        defaultValue={exerciseId ?? null}
        render={({ field, fieldState: { error } }) => {
          const selectField = {
            name: field.name,
            onBlur: field.onBlur,
            value: field.value
          }

          return (
            <SelectFieldWrap>
              <Select<Exercise, false, GroupBase<Exercise>>
                {...selectField}
                styles={exerciseSelectStyles}
                menuPortalTarget={selectMenuPortalTarget}
                menuPosition="fixed"
                isLoading={isLoading}
                isSearchable={!isTouchDevice}
                placeholder="-"
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id.toString()}
                formatGroupLabel={group => (
                  <GroupLabel>
                    <span>{group.label}</span>
                    <span>{group.options.length}</span>
                  </GroupLabel>
                )}
                options={selectOptions}
                components={{
                  Option: optionProps => (
                    <CustomOption {...optionProps} onToggleFavourite={handleToggleFavourite} />
                  )
                }}
                value={exerciseList.find(option => option.id === field.value) ?? null}
                onChange={selected => {
                  field.onChange(selected?.id ?? null)
                  handleOnChange(selected)
                }}
              />
              <GroupToggleRow>
                {(["none", "category", "complexity"] as ExerciseGroupBy[]).map(option => (
                  <GroupToggleButton
                    key={option}
                    type="button"
                    $active={groupBy === option}
                    onClick={() => setGroupBy(option)}
                  >
                    {GROUP_BY_LABELS[option]}
                  </GroupToggleButton>
                ))}
              </GroupToggleRow>
              {error && <span style={{ color: "red" }}>{error.message}</span>}
            </SelectFieldWrap>
          )
        }}
      />
    </SelectShell>
  )
}

const SelectShell = styled.div`
  min-width: 0;
`

const SelectFieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;

  > div:first-child {
    flex: 1;
    min-width: 0;
  }
`

const GroupToggleRow = styled.div`
  display: inline-flex;
  gap: 0.35rem;
  flex-wrap: nowrap;
  align-items: center;
`

const GroupToggleButton = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? "#399fff" : "rgba(57, 159, 255, 0.25)")};
  background: ${({ $active }) =>
    $active ? "rgba(57, 159, 255, 0.12)" : "rgba(255, 255, 255, 0.9)"};
  color: #4f4f4f;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.68rem;
  cursor: pointer;
`

const GroupLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const FavouriteButton = styled.button<{ $isActive: boolean }>`
  border: 0;
  background: transparent;
  color: ${({ $isActive }) => ($isActive ? "#d48806" : "#bfbfbf")};
  line-height: 1;
  padding: 0.1rem;
  cursor: pointer;

  svg {
    font-size: 1.1rem;
  }
`
