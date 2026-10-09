import { ButtonHTMLAttributes, FC } from "react"
import styled from "styled-components"
import LoaderSVG from "@root/assets/loading-eclipse.svg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  label?: string
}

export const Button: FC<ButtonProps> = ({
  isLoading,
  loadingText = "Loading...",
  label,
  ...rest
}) => {
  return (
    <PrimaryButton {...rest}>
      {isLoading && <Spinner />}
      {isLoading ? loadingText : label}
    </PrimaryButton>
  )
}

const Spinner = styled(LoaderSVG)`
  --size: 1.5rem;
  background: transparent !important;
  width: var(--size);
  height: var(--size);

  path {
    fill: var(--accent-contrast);
  }
`

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
  color: var(--text-3);
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
    background-color: var(--surface-elevated);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const StyledButton = styled.button`
  border-radius: 8px;
  border: 2px solid transparent;
  padding: 0.6em 1.7em;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  background: var(--accent-gradient);
  white-space: nowrap;
  color: var(--accent-contrast);
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: var(--accent-text);
  }
  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`

export const PrimaryButton = styled.button`
  padding: 0.75rem;
  background: var(--accent-gradient);
  color: var(--accent-contrast);
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: var(--accent-glow);
  transition:
    filter 0.2s,
    transform 0.1s;

  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    cursor: pointer;
    filter: brightness(1.1);
  }
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
