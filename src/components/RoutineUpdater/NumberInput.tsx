import { FC, SyntheticEvent, KeyboardEvent, FocusEvent } from "react"
import { useForm } from "react-hook-form"

interface NumberInputProps {
  fieldId: string
  register: ReturnType<typeof useForm>["register"]
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  handleChange: (event: SyntheticEvent) => void
  handleFocus: (event: FocusEvent<HTMLInputElement>) => void
  min?: number
  step?: number
  max?: number
}

export const NumberInput: FC<NumberInputProps> = ({
  fieldId,
  register,
  handleKeyDown,
  handleChange: handleBlur,
  handleFocus,
  min = 0,
  step,
  max
}) => {
  return (
    <input
      type="number"
      min={min}
      step={step}
      max={max}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      {...register(fieldId, {
        onChange: handleBlur
      })}
    />
  )
}
