import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { removeSetAction } from "@root/store/slices/routines/routines.thunks"
import type { IDType, MovementSet } from "@root/types/data"
import { useEffect, useCallback } from "react"
import type { FC, SyntheticEvent, KeyboardEvent, FocusEvent, PointerEvent } from "react"
import { useForm } from "react-hook-form"
import { ButtonGroup, IconButton } from "../__shared/Button"
import { FaTrash } from "react-icons/fa6"
import { NumberInput } from "./NumberInput"
import { WeightInput } from "./WeightInput"
import type { RootState } from "@root/store/store"
import styled from "styled-components"
import { Reorder, useDragControls } from "motion/react"
import { LuGripVertical } from "react-icons/lu"

interface SetRowProps {
  set: MovementSet
  movementId: IDType
  showActual: boolean
  onFieldChange: (payload: { setId: IDType; field: string; value: number }) => void
  onDelete: () => void
}

export const SetRow: FC<SetRowProps> = ({
  set,
  movementId,
  showActual,
  onFieldChange,
  onDelete
}) => {
  const dispatch = useAppDispatch()
  const dragControls = useDragControls()
  const _set = useAppSelector((state: RootState) =>
    state.routines.selected?.movements
      .find(m => m.id === movementId)
      ?.sets.find(s => s.id === set.id)
  )
  const resolvedSet = _set ?? set

  const { id, actualWeight, plannedWeight, actualReps, plannedReps } = resolvedSet

  const actualRepsFieldId = `set.${resolvedSet.id}.actualReps`
  const actualWeightFieldId = `set.${resolvedSet.id}.actualWeight`
  const plannedRepsFieldId = `set.${resolvedSet.id}.plannedReps`
  const plannedWeightFieldId = `set.${resolvedSet.id}.plannedWeight`
  const setsFieldId = `set.${resolvedSet.id}.sets`
  const isWUFieldId = `set.${resolvedSet.id}.isWU`

  const { register, setValue } = useForm({
    defaultValues: {
      [actualRepsFieldId]: actualReps || 0,
      [actualWeightFieldId]: actualWeight || 0,
      [plannedRepsFieldId]: plannedReps || 0,
      [plannedWeightFieldId]: plannedWeight || 0,
      [isWUFieldId]: resolvedSet.isWU || false,
      [setsFieldId]: 1
    }
  })

  const handleRemoveSet = () => {
    dispatch(removeSetAction({ setId: id, movementId }))
    onDelete()
  }

  const handleSetOnChange = useCallback(
    (event: SyntheticEvent) => {
      const target = event.target as HTMLInputElement
      const field = target.name.split(".")[2]
      const value = parseFloat(target.value)

      onFieldChange({ setId: id, field, value })
    },
    [id, onFieldChange]
  )

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
      "Home",
      "End"
    ]

    // Allow only numbers, a single period, and allowed control keys
    if (
      allowedKeys.includes(event.key) ||
      (event.key === "." && !event.currentTarget.value.includes(".")) ||
      (event.key >= "0" && event.key <= "9")
    ) {
      // Handle leading zeros
      if (event.key >= "0" && event.key <= "9" && event.currentTarget.value === "0") {
        event.preventDefault()
        event.currentTarget.value = event.key // Replace "0" with the new value typed
        handleSetOnChange(event)
      }

      return
    }

    // Prevent any other key press
    event.preventDefault()
  }

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select() // Select the entire input value on focus
  }

  const handleGripPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragControls.start(event)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: updates should run only when showActual toggles
  useEffect(() => {
    if (showActual) {
      setValue(actualRepsFieldId, actualReps || 0)
      setValue(actualWeightFieldId, actualWeight || 0)
    } else {
      setValue(plannedRepsFieldId, plannedReps || 0)
      setValue(plannedWeightFieldId, plannedWeight || 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActual])

  return (
    <Reorder.Item
      value={set.id}
      layout="position"
      dragControls={dragControls}
      dragListener={false}
      whileDrag={{ zIndex: "var(--layer-dragging)" }}
      className="set-grid set-row"
      style={{
        listStyle: "none",
        zIndex: "var(--layer-content)",
        position: "relative"
      }}
    >
      <NumberInput
        fieldId={setsFieldId}
        register={register}
        handleKeyDown={handleInputKeyDown}
        handleChange={handleSetOnChange}
        handleFocus={handleInputFocus}
      />
      {showActual ? (
        <>
          <NumberInput
            fieldId={actualRepsFieldId}
            register={register}
            handleKeyDown={handleInputKeyDown}
            handleChange={handleSetOnChange}
            handleFocus={handleInputFocus}
          />
          <WeightInput
            fieldId={actualWeightFieldId}
            register={register}
            handleKeyDown={handleInputKeyDown}
            handleChange={handleSetOnChange}
            handleFocus={handleInputFocus}
          />
        </>
      ) : (
        <>
          <NumberInput
            fieldId={plannedRepsFieldId}
            register={register}
            handleKeyDown={handleInputKeyDown}
            handleChange={handleSetOnChange}
            handleFocus={handleInputFocus}
          />
          <WeightInput
            fieldId={plannedWeightFieldId}
            register={register}
            handleKeyDown={handleInputKeyDown}
            handleChange={handleSetOnChange}
            handleFocus={handleInputFocus}
          />
        </>
      )}
      {/* Is WU checkbox - Is Warm Up? */}
      <StyledCheckbox type="checkbox" {...register(isWUFieldId)} />
      <ButtonGroup className="set-actions">
        <IconButton $size="sm" onClick={handleRemoveSet} $fontSize=".7rem">
          <FaTrash />
        </IconButton>
      </ButtonGroup>
      <SetGripTarget className="set-grip" onPointerDown={handleGripPointerDown}>
        <LuGripVertical />
      </SetGripTarget>
    </Reorder.Item>
  )
}

const StyledCheckbox = styled.input`
  margin: 0;
  height: 60%;
  width: 1.4rem;
`

const SetGripTarget = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  width: 1.4rem;
  height: 1.4rem;
  color: #a7a7a7;
  cursor: grab;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  svg {
    font-size: 1.1rem;
  }
`
