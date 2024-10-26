// FIXME : the issue with number columns being rendered correctly but when the drag starts it jumps down to top 0 relative to mouse position.
// also the drag is not limited to the input field and top and bottom of numbers column.

import React, { useState, useRef } from "react"
import ReactDOM from "react-dom"
import { motion } from "framer-motion"
import styled from "styled-components"
import { useForm, Controller } from "react-hook-form"
import { FixMeLater } from "@root/types/FixMeLater"

// Styled-components for overlay and content
export const OverlayWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const PositionedContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const StyledInput = styled.input`
  padding: 0.35rem 0.5rem;
  border-radius: 0.3rem;
  border: 1px solid #c9c9c9;

  &:hover {
    border-color: #399fff;
  }

  /* Hide the spinner in Chrome, Safari, Edge, and Opera */
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide the spinner in Firefox */
  &[type="number"] {
    appearance: textField;
  }
`

const NumberColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  color: #333;
  cursor: grab;
`

interface InputOverlayProps {
  isVisible: boolean
  targetRect: DOMRect | null
  value: number
  onClose: () => void
}

export const InputOverlay: React.FC<InputOverlayProps> = ({
  isVisible,
  targetRect,
  value,
  onClose
}) => {
  // Define a ref to track the current Y translation
  const numberColumnRef = React.useRef<HTMLDivElement | null>(null)
  const [currentTranslation, setCurrentTranslation] = React.useState(0)
  if (!isVisible || !targetRect) return null

  const minValue = Math.max(value - 5, 0)
  const maxValue = value + 5
  const numberDivHeight = 30 // Assume each number div is approximately 30px in height
  const numberColumnHeight = (maxValue - minValue + 1) * numberDivHeight

  const handleDrag = (_: FixMeLater, info: { offset: { y: number } }) => {
    const newTranslation = currentTranslation + info.offset.y

    // Helper function to check if the new translation is within bounds
    const isWithinBounds = (translation: number) => {
      const topBoundary = -(numberColumnHeight / 2) + targetRect.height / 2
      const bottomBoundary = numberColumnHeight / 2 - targetRect.height / 2
      return translation >= topBoundary && translation <= bottomBoundary
    }

    // If within bounds, update the translation state
    if (isWithinBounds(newTranslation)) {
      setCurrentTranslation(newTranslation)
    }
  }

  return ReactDOM.createPortal(
    <OverlayWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
    >
      <PositionedContainer
        style={{
          top: targetRect.top + window.scrollY,
          left: targetRect.left + window.scrollX,
          width: targetRect.width
        }}
      >
        <StyledInput type="text" value={value} readOnly />
        <NumberColumn
          as={motion.div}
          ref={numberColumnRef}
          drag="y"
          onDrag={handleDrag}
          style={{
            transform: `translateY(${currentTranslation}px)`
          }}
        >
          {/* Numbers above the selected value */}
          {[...Array(value).keys()].slice(minValue, value).map(num => (
            <div key={`above-${num}`}>{num}</div>
          ))}

          {/* The selected value */}
          <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{value}</div>

          {/* Numbers below the selected value */}
          {Array.from({ length: maxValue - value }, (_, i) => value + 1 + i).map(num => (
            <div key={`below-${num}`}>{num}</div>
          ))}
        </NumberColumn>
      </PositionedContainer>
    </OverlayWrapper>,
    document.getElementById("portal-root") as HTMLElement
  )
}

export const NumberInput: React.FC = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { control, handleSubmit } = useForm<{ number: number }>()

  const onSubmit = (data: { number: number }) => {
    console.log("Form Data:", data)
  }

  const handleInputClick = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setTargetRect(rect)
      setOverlayVisible(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="number"
        control={control}
        defaultValue={5}
        render={({ field }) => (
          <div style={{ position: "relative" }}>
            <StyledInput
              ref={inputRef}
              type="text"
              value={field.value}
              readOnly
              onClick={handleInputClick}
            />
            <InputOverlay
              isVisible={isOverlayVisible}
              targetRect={targetRect}
              value={field.value}
              onClose={() => setOverlayVisible(false)}
            />
          </div>
        )}
      />
      <button type="submit" style={{ marginTop: "1rem" }}>
        Submit
      </button>
    </form>
  )
}
