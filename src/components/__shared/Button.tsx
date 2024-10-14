import styled from "styled-components"

export const IconButton = styled.button.attrs({ type: "button" })`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-primary);
  transition: color 0.25s;

  width: 16px;
  height: 16px;
  border-radius: 10rem;
  position: relative;

  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    color: #646cff;
  }
`

export const Button = styled.button`
  border-radius: 8px;
  border: 2px solid transparent;
  padding: 0.6em 1.7em;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--color-primary);
  white-space: nowrap;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }
  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`

export const PrimaryButton = styled(Button)`
  color: white;
`

export const SecondaryButton = styled(Button)`
  color: white;
  background-color: #494949;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  & > * {
    flex: 1;
  }
`

/* 
const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`
 */
