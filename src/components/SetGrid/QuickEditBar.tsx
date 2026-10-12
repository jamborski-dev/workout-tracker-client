import { type FC, type PointerEvent, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { MdBackspace, MdCheck, MdChevronLeft, MdChevronRight, MdClose, MdKeyboard, MdRemove, MdAdd } from "react-icons/md"
import styled from "styled-components"
import type { CellKind } from "./types"
import { useTranslation } from "react-i18next"

const STEP: Record<CellKind, number> = { Reps: 1, Weight: 2.5 }
const MAX: Record<CellKind, number> = { Reps: 999, Weight: 999 }

const round = (value: number) => Math.round(value * 100) / 100
const format = (value?: number | null) => (value === null || value === undefined ? "" : String(value))

interface QuickEditBarProps {
  title: string
  kind: CellKind
  value: number | null
  planValue?: number | null
  prevValue?: number | null
  isActual: boolean
  canDone: boolean
  onChange: (value: number | null) => void
  onPrev: () => void
  onNext: () => void
  onDone: () => void
  onClose: () => void
}

// Input surface for set values: steppers, copy chips and a small keypad, so the native keyboard
// can stay closed. Rendered over the bottom navigation while a cell is being edited.
export const QuickEditBar: FC<QuickEditBarProps> = ({
  title,
  kind,
  value,
  planValue,
  prevValue,
  isActual,
  canDone,
  onChange,
  onPrev,
  onNext,
  onDone,
  onClose
}) => {
  const { t } = useTranslation()
  const [keypad, setKeypad] = useState(false)
  // First key after selecting a cell replaces the value instead of appending
  const fresh = useRef(true)
  const valueRef = useRef(value)
  valueRef.current = value
  const holdTimer = useRef<number>()
  const holdRepeat = useRef<number>()

  useEffect(() => {
    fresh.current = true
  }, [title])

  useEffect(() => () => stopHold(), [])

  const stopHold = () => {
    window.clearTimeout(holdTimer.current)
    window.clearInterval(holdRepeat.current)
  }

  const step = (direction: 1 | -1) => {
    const base = valueRef.current ?? prevValue ?? planValue ?? 0
    const next = Math.min(MAX[kind], Math.max(0, round(base + direction * STEP[kind])))
    valueRef.current = next
    fresh.current = true
    onChange(next)
  }

  const startHold = (direction: 1 | -1) => (event: PointerEvent) => {
    event.preventDefault()
    step(direction)
    holdTimer.current = window.setTimeout(() => {
      holdRepeat.current = window.setInterval(() => step(direction), 110)
    }, 400)
  }

  const add = (amount: number) => {
    const next = Math.min(MAX[kind], round((valueRef.current ?? prevValue ?? planValue ?? 0) + amount))
    fresh.current = true
    onChange(next)
  }

  const pressKey = (key: string) => {
    const base = fresh.current ? "" : format(valueRef.current)
    fresh.current = false
    if (key === "." && (kind === "Reps" || base.includes("."))) return
    const next = `${base}${key === "." && base === "" ? "0." : key}`.slice(0, 6)
    const parsed = Number(next)
    if (Number.isNaN(parsed) || parsed > MAX[kind]) return
    onChange(kind === "Reps" ? Math.round(parsed) : parsed)
  }

  const backspace = () => {
    const text = format(valueRef.current)
    fresh.current = false
    const next = text.slice(0, -1)
    onChange(next === "" || next === "." ? null : Number(next))
  }

  const keep = (event: PointerEvent) => event.preventDefault()

  return createPortal(
    <Bar data-quick-bar role="group" aria-label={t("bar.quickEdit")} onPointerDown={keep}>
      <Top>
        <strong>{title}</strong>
        <IconBtn type="button" aria-label={t("bar.close")} onClick={onClose}>
          <MdClose />
        </IconBtn>
      </Top>

      <Stepper>
        <Big
          type="button"
          aria-label={t("bar.decrease")}
          onPointerDown={startHold(-1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
        >
          <MdRemove />
        </Big>
        <Readout>
          {value === null ? "–" : value}
          <small>{kind === "Weight" ? "kg" : t("bar.repsUnit")}</small>
        </Readout>
        <Big
          type="button"
          aria-label={t("bar.increase")}
          onPointerDown={startHold(1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
        >
          <MdAdd />
        </Big>
      </Stepper>

      <Chips>
        {isActual && planValue !== null && planValue !== undefined && (
          <Chip type="button" onClick={() => onChange(planValue)}>
            {t("bar.eqPlan", { value: planValue })}
          </Chip>
        )}
        {prevValue !== null && prevValue !== undefined && (
          <Chip type="button" onClick={() => onChange(prevValue)}>
            {t("bar.eqPrev", { value: prevValue })}
          </Chip>
        )}
        {kind === "Weight" && (
          <>
            <Chip type="button" onClick={() => add(2.5)}>
              +2.5
            </Chip>
            <Chip type="button" onClick={() => add(5)}>
              +5
            </Chip>
          </>
        )}
        <Chip type="button" onClick={() => onChange(null)}>
          {t("bar.clear")}
        </Chip>
      </Chips>

      {keypad && (
        <Keypad>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(key => (
            <Key key={key} type="button" disabled={key === "." && kind === "Reps"} onClick={() => pressKey(key)}>
              {key}
            </Key>
          ))}
          <Key type="button" aria-label={t("bar.backspace")} onClick={backspace}>
            <MdBackspace />
          </Key>
        </Keypad>
      )}

      <Nav>
        <IconBtn type="button" aria-label={t("bar.prevCell")} onClick={onPrev}>
          <MdChevronLeft />
        </IconBtn>
        <IconBtn type="button" aria-label={t("bar.nextCell")} onClick={onNext}>
          <MdChevronRight />
        </IconBtn>
        <IconBtn type="button" aria-label={t("bar.numberPad")} aria-pressed={keypad} onClick={() => setKeypad(open => !open)}>
          <MdKeyboard />
        </IconBtn>
        <span style={{ flex: 1 }} />
        {canDone && (
          <DoneBtn type="button" onClick={onDone}>
            <MdCheck /> {t("bar.done")}
          </DoneBtn>
        )}
      </Nav>
    </Bar>,
    document.body
  )
}

export const QUICK_BAR_SPACE = "17rem"

const Bar = styled.div`
  box-sizing: border-box;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: min(100%, 430px);
  z-index: var(--layer-popup);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem calc(0.7rem + env(safe-area-inset-bottom));
  background: var(--surface-elevated);
  border-top: 1px solid var(--border-default);
  user-select: none;
  touch-action: manipulation;
`

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-2);
`

const Stepper = styled.div`
  display: grid;
  grid-template-columns: 3.4rem 1fr 3.4rem;
  gap: 0.6rem;
  align-items: stretch;
`

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: var(--surface);
  color: var(--text-1);
  padding: 0;
  cursor: pointer;

  svg {
    flex-shrink: 0;
  }
`

const Big = styled(Btn)`
  height: 3rem;
  font-size: 1.6rem;
`

const Readout = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.35rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-1);
  font-variant-numeric: tabular-nums;
  align-self: center;

  small {
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--text-3);
  }
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`

const Chip = styled(Btn)`
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
`

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
`

const Key = styled(Btn)`
  height: 2.6rem;
  font-size: 1.1rem;

  &:disabled {
    opacity: 0.35;
  }
`

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const IconBtn = styled(Btn)`
  width: 2.4rem;
  height: 2.4rem;
  font-size: 1.3rem;

  &[aria-pressed="true"] {
    border-color: var(--accent);
    color: var(--accent-text);
  }
`

const DoneBtn = styled(Btn)`
  height: 2.4rem;
  padding: 0 1.1rem;
  gap: 0.3rem;
  font-weight: 600;
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-contrast);
`
