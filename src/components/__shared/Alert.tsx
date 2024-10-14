import { Alert as AlertType } from "@root/types/data"
import { FC } from "react"
import { FaHeartBroken } from "react-icons/fa"
import { FaCircleInfo } from "react-icons/fa6"
import { IoWarning } from "react-icons/io5"
import styled from "styled-components"

interface AlertProps {
  alert: AlertType
  onDismiss?: () => void
}

export const Alert: FC<AlertProps> = ({ alert, onDismiss }) => {
  const Icon = getIcon(alert.severity)

  const handleDismiss = () => {
    onDismiss?.()
  }

  return (
    <Root severity={alert.severity}>
      <Icon />
      <div>
        {/* <h3>{capitaliseWord(alert.severity)}</h3> */}
        <p>{alert.message}</p>
      </div>
      {onDismiss && <DismissButton onClick={handleDismiss} />}
    </Root>
  )
}

const getIcon = (severity: "info" | "warning" | "error") => {
  switch (severity) {
    case "info":
      return FaCircleInfo
    case "warning":
      return IoWarning
    case "error":
      return FaHeartBroken
  }
}

const Root = styled.div<{ severity: "info" | "warning" | "error" }>`
  --color: ${({ severity }) => {
    switch (severity) {
      case "info":
        return "hsl(206, 70%, 50%)"
      case "warning":
        return "hsl(35, 70%, 50%)"
      case "error":
        return "hsl(4, 60%, 50%)"
    }
  }};

  display: flex;
  position: relative;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: var(--color);
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;

  h3 {
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  p {
    font-weight: 400;
    margin: 0;
  }

  svg {
    font-size: 1.6rem;
  }
`

const DismissButton = styled.button`
  position: absolute;
  top: 0;
  transform: translate(-30%, -30%);
  left: 0;
  width: 1rem;
  height: 1rem;
  padding: 0;
  display: block;
  z-index: 1;
  background-color: #e7e7e7;
  border: none;
  font-weight: 500;
  color: #5f5f5f;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.309);

  &:before {
    position: absolute;
    top: 50%;
    left: 50%;
    content: "×";
    display: block;
    transform: translate(-50%, -50%);
    font-size: 1rem;
  }

  &:hover {
    background-color: #ffffff;
  }
`
