/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC, SyntheticEvent, KeyboardEvent, FocusEvent } from "react"
import { NumberInput } from "./NumberInput"
import type { useForm } from "react-hook-form"
import styled from "styled-components"

export const WeightInput: FC<{
  fieldId: string
  register: ReturnType<typeof useForm>["register"]
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  handleChange: (event: SyntheticEvent) => void
  handleFocus: (event: FocusEvent<HTMLInputElement>) => void
}> = ({ fieldId, register, handleKeyDown, handleChange, handleFocus }) => {
  return (
    <WeightInputContainer>
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
    </WeightInputContainer>
  )
}

const WeightInputContainer = styled.div`
  width: 60px;
  position: relative;

  input {
    width: 100%;
    background-color: var(--surface);
    z-index: 1;
  }

  span {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    color: var(--text-3);
    z-index: 0;
    user-select: none;
  }
`
