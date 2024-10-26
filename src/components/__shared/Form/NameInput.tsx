import { FC, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import styled from "styled-components"

interface NameInputProps {
  id: string
  defaultValue?: string
}

export const NameInput: FC<NameInputProps> = ({ id, defaultValue }) => {
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
    <Input id={id} type="text" {...register(id, { required: true, minLength: 3, maxLength: 50 })} />
    // TODO add error as absolute positioned element under the form to not mess with the layout need some padding
  )
}

const Input = styled.input`
  font-size: 1.2rem;
  margin: 0;
  font-weight: 400;
  text-align: center;
  line-height: 1.6;
  padding: 0;
  border: none;
  border-bottom: 1px solid lightgray;
  max-width: 70%;
  background: none;

  &:focus {
    outline: none;
    border-color: skyblue;
  }
`
