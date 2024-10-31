import { FC, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import styled from "styled-components"

interface DateInputProps {
  id: string
  defaultValue?: string
}

export const DateInput: FC<DateInputProps> = ({ id, defaultValue }) => {
  const { register, setValue } = useFormContext()

  useEffect(() => {
    setValue(id, defaultValue)
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
  color: #22222299;

  &:focus {
    outline: none;
    border-color: skyblue;
  }
`
