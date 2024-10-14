import styled from "styled-components"

export const Form = styled.form`
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  input[type="radio"] {
    margin-right: 0.5rem;
  }

  label {
    font-weight: 400;
    font-size: 0.8rem;
  }
`

export const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`

export const Fieldset = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
