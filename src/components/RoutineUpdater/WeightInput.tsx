import { FC, SyntheticEvent, KeyboardEvent, FocusEvent } from "react"
import { NumberInput } from "./NumberInput"
import { useForm } from "react-hook-form"

export const WeightInput: FC<{
  fieldId: string
  register: ReturnType<typeof useForm>["register"]
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  handleChange: (event: SyntheticEvent) => void
  handleFocus: (event: FocusEvent<HTMLInputElement>) => void
}> = ({ fieldId, register, handleKeyDown, handleChange, handleFocus }) => {
  return (
    <div className="weight-input">
      <NumberInput
        fieldId={fieldId}
        register={register}
        handleKeyDown={handleKeyDown}
        handleChange={handleChange}
        handleFocus={handleFocus}
        step={0.5}
        max={999}
      />
      <span>kg</span>
    </div>
  )
}
