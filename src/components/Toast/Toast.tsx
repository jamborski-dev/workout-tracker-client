// TODO: change state architecture to be possible to stack multiple toasts at the same time

import { FC, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { FaHeartBroken } from "react-icons/fa"
import { FaCircleInfo } from "react-icons/fa6"
import { IoWarning } from "react-icons/io5"
import styled from "styled-components"

export type ToastType = "info" | "success" | "error" | "warning"

interface ToastProps {
  message: string
  type: ToastType
  onDismiss?: () => void
}

const FADE_OUT_DURATION = 300

export const Toast: FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [visible, setVisible] = useState(true)
  const Icon = getIcon(type)

  // const handleDismissClick = () => {
  //   setVisible(false)
  //   setTimeout(() => {
  //     onDismiss?.()
  //   }, FADE_OUT_DURATION)
  // }

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)

      setTimeout(() => {
        onDismiss?.()
      }, FADE_OUT_DURATION)
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [onDismiss])

  return createPortal(
    <ToastContainer $show={visible} $type={type}>
      <Flex>
        <Icon />
        <div>
          {/* <h3>{capitaliseWord(alert.severity)}</h3> */}
          <p>{message}</p>
        </div>
      </Flex>
      {/* 
      {onDismiss && <DismissButton onClick={handleDismissClick} />}
       */}
    </ToastContainer>,
    document.getElementById("toast-root") as HTMLElement
  )
}

const ToastContainer = styled.div<{ $show: boolean; $type: ToastType }>`
  --color: ${({ $type }) => {
    switch ($type) {
      case "success":
        return "hsl(93, 60%, 40%)"
      case "info":
        return "hsl(206, 70%, 50%)"
      case "warning":
        return "hsl(35, 70%, 50%)"
      case "error":
        return "hsl(4, 60%, 50%)"
    }
  }};

  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: var(--color);
  color: white;
  font-weight: bold;
  z-index: 100;

  transition: opacity ${FADE_OUT_DURATION}ms ease-in-out;
  opacity: ${({ $show }) => ($show ? 1 : 0)};

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

const Flex = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const getIcon = (type: ToastType) => {
  switch (type) {
    case "warning":
      return IoWarning
    case "error":
      return FaHeartBroken
    case "info":
    default:
      return FaCircleInfo
  }
}

// const DismissButton = styled.button`
//   position: absolute;
//   top: 0;
//   transform: translate(-30%, -30%);
//   left: 0;
//   width: 1rem;
//   height: 1rem;
//   padding: 0;
//   display: block;
//   z-index: 1;
//   background-color: #e7e7e7;
//   border: none;
//   font-weight: 500;
//   color: #5f5f5f;
//   font-size: 1.4rem;
//   cursor: pointer;
//   box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.309);

//   &:before {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     content: "×";
//     display: block;
//     transform: translate(-50%, -50%);
//     font-size: 1rem;
//   }

//   &:hover {
//     background-color: #ffffff;
//   }
// `
