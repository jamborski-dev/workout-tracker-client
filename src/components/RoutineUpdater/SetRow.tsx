import { useAppDispatch } from "@root/store/hooks/store"
import { removeSetAction } from "@root/store/slices/routines/routines.thunks"
import { IDType, MovementSet } from "@root/types/data"
import { FC, SyntheticEvent, KeyboardEvent, FocusEvent, useEffect } from "react"
import { useForm } from "react-hook-form"
import { ButtonGroup, IconButton } from "../__shared/Button"
import { FaTrash } from "react-icons/fa6"
import { NumberInput } from "./NumberInput"
import { WeightInput } from "./WeightInput"

const userId = 1
const routineId = 1

interface SetRowProps {
  set: MovementSet
  movementId: IDType
  showActual: boolean
  onFieldChange: (setId: IDType, field: string, value: number) => void
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

  const { id, actualWeight, plannedWeight, actualReps, plannedReps } = set

  const actualRepsFieldId = `set.${set.id}.actualReps`
  const actualWeightFieldId = `set.${set.id}.actualWeight`
  const plannedRepsFieldId = `set.${set.id}.plannedReps`
  const plannedWeightFieldId = `set.${set.id}.plannedWeight`

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

  const handleSetOnChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement
    const field = target.name
    const value = parseFloat(target.value)

    onFieldChange(id!, field, value)
  }

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
      }

      return
    }

    // Prevent any other key press
    event.preventDefault()
  }

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select() // Select the entire input value on focus
  }

  useEffect(() => {
    if (showActual) {
      setValue(actualRepsFieldId, actualReps || 0)
      setValue(actualWeightFieldId, actualWeight || 0)
    } else {
      setValue(plannedRepsFieldId, plannedReps || 0)
      setValue(plannedWeightFieldId, plannedWeight || 0)
    }
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
      </ButtonGroup>
    </li>
  )
}
