import styled from "styled-components"

export const StyledFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 14rem;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: 300;
`

export const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    border-color: var(--app-accent);
  }
`

export const ErrorMessage = styled.span`
  color: #d9534f;
  font-size: 0.875rem;
`

export const InfoMessage = styled.span`
  color: #2f7d6d;
  font-size: 0.875rem;
`

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #888;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #ddd;
  }
`

export const SecondaryButton = styled.button.attrs({ type: "button" })`
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: transparent;
  font-size: 0.95rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

export const LinkButton = styled.button.attrs({ type: "button" })`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  color: var(--app-accent);
  text-align: left;
  cursor: pointer;
`
