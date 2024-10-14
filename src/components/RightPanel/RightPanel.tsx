import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { selectRightPanel, setRightPanel } from "@store/slices/page/page.slice"
import styled, { keyframes } from "styled-components"
import { RoutineForm } from "@root/components/_forms/Routine.form"
import { FC, useEffect, useState } from "react"

const RightPanelError = () => <CenterDiv>Right panel not found</CenterDiv>

// Mapping object
const viewMap: { [key: string]: FC } = {
  routineForm: RoutineForm,
  error: RightPanelError
}

export const RightPanel = () => {
  const dispatch = useAppDispatch()
  const rightPanelState = useAppSelector(selectRightPanel)
  const [isClosing, setIsClosing] = useState(false) // Tracks if panel is closing
  const [isViewVisible, setIsViewVisible] = useState(false) // Tracks view animation
  const show = Boolean(rightPanelState) && !isClosing
  const View = viewMap[rightPanelState?.view || "error"] || viewMap.error

  useEffect(() => {
    if (show) {
      setIsViewVisible(true) // Trigger fade-in when panel is shown
    } else if (!show && isClosing) {
      // Trigger fade-out
      setIsViewVisible(false)
    }
  }, [show, isClosing])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsViewVisible(false) // Start fade-out animation
        setIsClosing(true) // Start closing animation after fade-out
        setTimeout(() => {
          dispatch(setRightPanel(undefined)) // Only dispatch after animation
          setIsClosing(false) // Reset closing state
        }, 300) // Match this duration with the CSS transition time
      }
    }

    if (show) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [show, dispatch])

  return (
    <Root $show={show}>
      <Header>
        <h2>{rightPanelState?.title || ""}</h2>
      </Header>
      <Content>
        <ViewWrapper $isVisible={isViewVisible}>
          <View />
        </ViewWrapper>
      </Content>
    </Root>
  )
}

// Fade-in and fade-out animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const Root = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  z-index: 10;
  display: flex;
  flex-direction: column;

  transform: translateX(${({ $show }) => ($show ? "0" : "100%")});
  transition: transform 0.3s;

  overflow-x: scroll;
`

const Header = styled.div`
  background-color: #222;
  color: white;
  padding: 2rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`

const Content = styled.div`
  background-color: #333;
  color: white;
  padding: 2rem;
  width: 100%;
  flex: 1;
`

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const ViewWrapper = styled.div<{ $isVisible: boolean }>`
  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} 0.3s forwards;
`
