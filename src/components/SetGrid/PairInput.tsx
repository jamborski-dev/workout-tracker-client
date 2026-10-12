import { type FC, type FocusEvent, useEffect, useState } from "react"
import styled from "styled-components"
import type { CellKind, CellSide } from "./types"

const format = (value?: number | null) => (value === null || value === undefined ? "" : String(value))

const parse = (text: string, kind: CellKind): number | null => {
  if (text === "" || text === ".") return null
  const value = Number(text)
  if (Number.isNaN(value)) return null
  return kind === "Reps" ? Math.round(value) : value
}

// Reps are whole numbers; weight allows one decimal point. Empty is null, never 0.
const clean = (raw: string, kind: CellKind) => {
  const stripped = raw.replace(kind === "Reps" ? /\D/g : /[^\d.]/g, "")
  if (kind === "Reps") return stripped.slice(0, 4)
  const [whole, ...rest] = stripped.split(".")
  return (rest.length ? `${whole}.${rest.join("")}` : whole).slice(0, 6)
}

const Half: FC<{
  value?: number | null
  kind: CellKind
  side: CellSide
  cellId: string
  ghost: boolean
  label: string
  onFocus: () => void
  onChange: (value: number | null) => void
}> = ({ value, kind, side, cellId, ghost, label, onFocus, onChange }) => {
  const [text, setText] = useState(format(value))

  // Stepper / keypad / Done change the value from outside; keep a half-typed "10." as is
  useEffect(() => {
    setText(current => (parse(current, kind) === (value ?? null) ? current : format(value)))
  }, [value, kind])

  return (
    <input
      type="text"
      // inputMode none keeps the native keyboard closed; the quick edit bar is the input surface.
      // A physical keyboard still types into the focused cell.
      inputMode="none"
      autoComplete="off"
      aria-label={label}
      data-cell={cellId}
      data-side={side}
      data-ghost={ghost}
      placeholder="–"
      value={text}
      onFocus={(event: FocusEvent<HTMLInputElement>) => {
        event.target.select()
        onFocus()
      }}
      onChange={event => {
        const next = clean(event.target.value, kind)
        setText(next)
        onChange(parse(next, kind))
      }}
    />
  )
}

interface PairInputProps {
  setId: string
  kind: CellKind
  planned?: number | null
  actual?: number | null
  // Which half is being edited (null when this pair is not the active cell)
  activeSide: CellSide | null
  anyActive: boolean
  showActual: boolean
  onFocusSide: (side: CellSide) => void
  onChange: (side: CellSide, value: number | null) => void
}

export const PairInput: FC<PairInputProps> = ({
  setId,
  kind,
  planned,
  actual,
  activeSide,
  anyActive,
  showActual,
  onFocusSide,
  onChange
}) => (
  <Pair data-active={activeSide !== null} data-single={!showActual}>
    <Half
      value={planned}
      kind={kind}
      side="planned"
      cellId={`${setId}:${kind}:planned`}
      // Both values stay visible; whatever is not being edited is ghosted
      ghost={anyActive && activeSide !== "planned"}
      label={`${kind} (plan)`}
      onFocus={() => onFocusSide("planned")}
      onChange={value => onChange("planned", value)}
    />
    {showActual && (
      <Half
        value={actual}
        kind={kind}
        side="actual"
        cellId={`${setId}:${kind}:actual`}
        ghost={anyActive && activeSide !== "actual"}
        label={`${kind} (actual)`}
        onFocus={() => onFocusSide("actual")}
        onChange={value => onChange("actual", value)}
      />
    )}
  </Pair>
)

const Pair = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-width: 0;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: var(--surface);
  overflow: hidden;

  &[data-single="true"] {
    grid-template-columns: 1fr;
  }

  &[data-active="true"] {
    border-color: var(--accent);
  }

  input {
    min-width: 0;
    width: 100%;
    padding: 0.35rem 0.3rem;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--text-1);
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    outline: none;
  }

  /* planned left aligned, actual right aligned */
  input[data-side="planned"] {
    text-align: left;
    padding-left: 0.45rem;
    color: var(--text-2);
  }

  input[data-side="actual"] {
    text-align: right;
    padding-right: 0.45rem;
    border-left: 1px solid var(--border-subtle);
  }

  input[data-ghost="true"] {
    color: var(--text-3);
  }

  input:focus {
    background: var(--accent-soft);
    color: var(--text-1);
  }
`
