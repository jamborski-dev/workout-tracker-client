import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { removeSetAction } from "@root/store/slices/routines/routines.thunks"
import { IDType, MovementSet } from "@root/types/data"
import { FC, SyntheticEvent, KeyboardEvent, FocusEvent, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { ButtonGroup, IconButton } from "../__shared/Button"
import { FaTrash } from "react-icons/fa6"
import { NumberInput } from "./NumberInput"
import { WeightInput } from "./WeightInput"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { RootState } from "@root/store/store"
import { reorderSets } from "@root/store/slices/routines/routines.slice"

const userId = 1
const routineId = 1

const allowReorder = false // FIXME there is an issue with re-rendering when this is true, state updates but UI not, need to investigate later
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
  const _set = useAppSelector((state: RootState) =>
    state.routines.selected?.movements
      .find(m => m.id === movementId)
      ?.sets.find(s => s.id === set.id)
  )!

  const { id, actualWeight, plannedWeight, actualReps, plannedReps, order } = _set

  const canMoveUp = order > 0
  const canMoveDown = useAppSelector((state: RootState) => {
    const movement = state.routines.selected?.movements.find(m => m.id === movementId)
    return movement ? order < movement.sets.length - 1 : false
  })

  const actualRepsFieldId = `set.${_set.id}.actualReps`
  const actualWeightFieldId = `set.${_set.id}.actualWeight`
  const plannedRepsFieldId = `set.${_set.id}.plannedReps`
  const plannedWeightFieldId = `set.${_set.id}.plannedWeight`

  const { register, setValue } = useForm({
    defaultValues: {
      [actualRepsFieldId]: actualReps || 0,
      [actualWeightFieldId]: actualWeight || 0,
      [plannedRepsFieldId]: plannedReps || 0,
      [plannedWeightFieldId]: plannedWeight || 0
    }
  })

  const handleRemoveSet = () => {
    dispatch(removeSetAction({ userId, routineId, movementId, setId: id! }))
    onDelete()
  }

  const handleSetOnChange = useCallback(
    (event: SyntheticEvent) => {
      const target = event.target as HTMLInputElement
      const field = target.name.split(".")[2]
      const value = parseFloat(target.value)

      onFieldChange({ setId: id!, field, value })
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

  const handleReorderUp = () => {
    dispatch(reorderSets({ movementId, setId: id as number, direction: "up" }))
  }

  const handleReorderDown = () => {
    dispatch(reorderSets({ movementId, setId: id as number, direction: "down" }))
  }

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
    <li>
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
      <ButtonGroup>
        <IconButton $size="sm" onClick={handleRemoveSet} $fontSize=".7rem">
          <FaTrash />
        </IconButton>
        {allowReorder && (
          <>
            <IconButton $size="sm" onClick={handleReorderUp} disabled={!canMoveUp}>
              <IoIosArrowUp />
            </IconButton>
            <IconButton $size="sm" onClick={handleReorderDown} disabled={!canMoveDown}>
              <IoIosArrowDown />
            </IconButton>
          </>
        )}
      </ButtonGroup>
    </li>
  )
}
