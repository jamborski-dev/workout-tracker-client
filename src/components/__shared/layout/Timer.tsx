import styled from "styled-components"
import { FC, useEffect, useState } from "react"
import { useAppSelector } from "@root/store/hooks/store"
import { selectTimer } from "@root/store/slices/app/app.slice"
import { motion } from "framer-motion"

export const Timer: FC = () => {
  const timer = useAppSelector(selectTimer)
  const timerId = useAppSelector(state => state.app.uuid)
  const [width, setWidth] = useState("100%")
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (timer > 0) {
      setWidth("100%")
      setOpacity(1)
      const interval = setInterval(() => {
        setWidth(prevWidth => {
          const newWidth = parseFloat(prevWidth) - 100 / (timer / 10)
          return newWidth > 0 ? `${newWidth}%` : "0%"
        })
        setOpacity(prevOpacity => {
          const newOpacity = parseFloat(prevOpacity.toString()) - 1 / (timer / 10)
          return newOpacity > 0 ? newOpacity : 0
        })
      }, 10)

      return () => clearInterval(interval)
    } else {
      setWidth("0%")
      setOpacity(0)
    }
  }, [timer, timerId])

  return (
    <TimerContainer>
      <StyledTimerBar
        initial={{ width: "100%", opacity: 0 }}
        animate={{ width, opacity }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </TimerContainer>
  )
}

const StyledTimerBar = styled(motion.div)`
  height: 4px;
  background-color: #5db9b8;
  border-radius: 5px;
  /* border-top-right-radius: 5px; */
  /* border-bottom-right-radius: 5px; */
`

const TimerContainer = styled.div`
  width: 60%;
  background-color: transparent;
  padding: 0.5rem;
  box-sizing: border-box;
  margin: 1rem auto 0;
`
