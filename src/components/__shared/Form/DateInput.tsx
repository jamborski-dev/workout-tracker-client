import { type FC, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import styled from "styled-components"

interface DateInputProps {
  id: string
  defaultValue?: string
}

const toInputDateValue = (rawDate?: string): string => {
  if (!rawDate) {
    return ""
  }

  // Keep API date strings stable for <input type="date">.
  const isoDateMatch = rawDate.match(/^\d{4}-\d{2}-\d{2}/)
  if (isoDateMatch) {
    return isoDateMatch[0]
  }

  const parsedDate = new Date(rawDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return ""
  }

  const year = parsedDate.getFullYear()
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, "0")
  const day = `${parsedDate.getDate()}`.padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const DateInput: FC<DateInputProps> = ({ id, defaultValue }) => {
  const { register, setValue } = useFormContext()

  useEffect(() => {
    setValue(id, toInputDateValue(defaultValue))
    if (!id) return

    const input = document.querySelector(`#${id}`) as HTMLInputElement
    if (input) {
      input.focus()
    }
  }, [id, defaultValue, setValue])

  return (
    <Input
      id={id}
      type="date"
      defaultValue={toInputDateValue(defaultValue)}
      {...register(id, { required: true, setValueAs: (value: string) => new Date(value) })}
    />
    // TODO add error as absolute positioned element under the form to not mess with the layout need some padding
  )
}

const Input = styled.input`
  margin: 0;
  font-weight: 400;
  text-align: center;
  line-height: 1.2;
  padding: 0;
  border: none;
  border-bottom: 1px solid lightgray;
  background: none;
  margin-right: 1rem;

  font-size: 0.8rem;
  color: var(--text-2);

  &:focus {
    outline: none;
    border-color: skyblue;
  }
`
