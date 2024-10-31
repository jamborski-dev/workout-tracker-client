import styled from "styled-components"

const sizeMap = {
  sm: 0.8,
  md: 1,
  lg: 1.3
}

export const IconButton = styled.button.attrs({ type: "button" })<{
  $fontSize?: string
  $size?: "sm" | "md" | "lg"
}>`
  --size-multiplier: ${({ $size }) => sizeMap[$size ?? "md"]};
  --size: calc(2rem * var(--size-multiplier));
  width: var(--size);
  height: var(--size);
  background-color: transparent;
  border: none;
  color: #aeaeae;
  cursor: pointer;
  border-radius: 1000px;
  position: relative;
  padding: 0;

  transition: background-color 0.1s;
  transform-origin: center;
  cursor: pointer;

  & > svg {
    font-size: ${({ $fontSize }) => $fontSize ?? `calc(1rem * var(--size-multiplier))`};
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:not(:disabled):hover {
    background-color: #f1f1f1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

export const ButtonGroup = styled.div<{
  $gap?: number
  $direction?: "row" | "column"
  $alignItems?: "start" | "center" | "end"
}>`
  display: flex;
  gap: ${({ $gap }) => $gap ?? 1}rem;
  align-items: ${({ $alignItems }) => $alignItems ?? "center"};
  flex-direction: ${({ $direction }) => $direction ?? "row"};
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
