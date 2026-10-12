import type { IDType } from "@root/types/data"
import { Reorder, useDragControls } from "motion/react"
import { type FC, type PointerEvent, useCallback, useEffect, useMemo, useState } from "react"
import { MdCheck } from "react-icons/md"
import { FaTrash } from "react-icons/fa6"
import { LuGripVertical } from "react-icons/lu"
import styled from "styled-components"
import { PairInput } from "./PairInput"
import { QUICK_BAR_SPACE, QuickEditBar } from "./QuickEditBar"
import type { ActiveCell, CellKind, CellSide, GridChange, GridSet } from "./types"

interface SetGridProps {
  // routine: plan + actual halves, Done column. template: plan only.
  mode: "routine" | "template"
  title: string
  sets: GridSet[]
  onChange: GridChange
  onDelete: (setId: IDType) => void
  onReorder: (setIds: IDType[]) => void
  // Routine mode: tick a set off (fills empty actuals from the plan)
  onToggleDone?: (setId: IDType) => void
  // Hide the legend while the surrounding card is collapsed
  showLegend?: boolean
}

const fieldName = (side: CellSide, kind: CellKind) => `${side}${kind}`

export const SetGrid: FC<SetGridProps> = ({ mode, title, sets, onChange, onDelete, onReorder, onToggleDone, showLegend = true }) => {
  const isRoutine = mode === "routine"
  const [active, setActive] = useState<ActiveCell | null>(null)

  const currentSetId = sets.find(set => !set.completed)?.id

  // Cell order for the bar's previous / next: reps then weight, per set, on the same side
  const cells = useMemo(
    () =>
      sets.flatMap(set =>
        (["Reps", "Weight"] as CellKind[]).map(kind => ({ setId: set.id, kind }))
      ),
    [sets]
  )

  const focusCell = useCallback((setId: IDType, kind: CellKind, side: CellSide) => {
    const input = document.querySelector<HTMLInputElement>(`[data-cell="${setId}:${kind}:${side}"]`)
    input?.focus()
    input?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [])

  // Tap outside the grid and the bar closes it
  useEffect(() => {
    if (!active) return
    const close = (event: Event) => {
      const target = event.target as Element
      if (target.closest("[data-quick-bar]") || target.closest("[data-cell]")) return
      setActive(null)
    }
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setActive(null)
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", escape)
    }
  }, [active])

  // The active set may have been deleted
  useEffect(() => {
    if (active && !sets.some(set => set.id === active.setId)) setActive(null)
  }, [active, sets])

  const move = (direction: 1 | -1) => {
    if (!active) return
    const index = cells.findIndex(cell => cell.setId === active.setId && cell.kind === active.kind)
    const next = cells[index + direction]
    if (!next) return setActive(null)
    setActive({ ...active, setId: next.setId, kind: next.kind })
    focusCell(next.setId, next.kind, active.side)
  }

  const activeSet = active ? sets.find(set => set.id === active.setId) : undefined
  const activeIndex = activeSet ? sets.indexOf(activeSet) : -1
  const prevSet = activeIndex > 0 ? sets[activeIndex - 1] : undefined

  const handleDone = () => {
    if (!active || !onToggleDone) return
    if (!activeSet?.completed) onToggleDone(active.setId)
    const next = sets[activeIndex + 1]
    if (!next) return setActive(null)
    setActive({ setId: next.id, kind: "Reps", side: active.side })
    focusCell(next.id, "Reps", active.side)
  }

  return (
    <Grid data-mode={mode}>
      {isRoutine && showLegend && <Legend>Left: plan · Right: actual</Legend>}
      <Reorder.Group
        axis="y"
        as="ul"
        values={sets.map(set => set.id)}
        onReorder={onReorder}
        style={{ padding: 0, margin: 0, overscrollBehaviorY: "contain" }}
      >
        <li className="set-grid set-header-row">
          <span />
          <span>#</span>
          <span>Reps</span>
          <span>Weight (kg)</span>
          <span>WU</span>
          {isRoutine && <span>Done</span>}
          <span />
          <span />
        </li>
        {sets.map((set, index) => (
          <Row
            key={set.id}
            set={set}
            index={index}
            isRoutine={isRoutine}
            isCurrent={isRoutine && set.id === currentSetId && !set.completed}
            active={active?.setId === set.id ? active : null}
            anyActive={active !== null}
            onFocusCell={(kind, side) => setActive({ setId: set.id, kind, side })}
            onChange={onChange}
            onDelete={onDelete}
            onToggleDone={onToggleDone}
          />
        ))}
      </Reorder.Group>

      {active && activeSet && (
        <>
          <div style={{ height: QUICK_BAR_SPACE }} />
          <QuickEditBar
            title={`${title} · Set ${activeIndex + 1} · ${active.kind}${isRoutine ? ` (${active.side === "planned" ? "plan" : "actual"})` : ""}`}
            kind={active.kind}
            value={(activeSet[fieldName(active.side, active.kind) as keyof GridSet] as number | null | undefined) ?? null}
            planValue={activeSet[fieldName("planned", active.kind) as keyof GridSet] as number | null | undefined}
            prevValue={
              prevSet
                ? ((prevSet[fieldName(active.side, active.kind) as keyof GridSet] as number | null | undefined) ?? null)
                : null
            }
            isActual={active.side === "actual"}
            canDone={isRoutine}
            onChange={value => onChange(active.setId, fieldName(active.side, active.kind), value)}
            onPrev={() => move(-1)}
            onNext={() => move(1)}
            onDone={handleDone}
            onClose={() => setActive(null)}
          />
        </>
      )}
    </Grid>
  )
}

const Row: FC<{
  set: GridSet
  index: number
  isRoutine: boolean
  isCurrent: boolean
  active: ActiveCell | null
  anyActive: boolean
  onFocusCell: (kind: CellKind, side: CellSide) => void
  onChange: GridChange
  onDelete: (setId: IDType) => void
  onToggleDone?: (setId: IDType) => void
}> = ({ set, index, isRoutine, isCurrent, active, anyActive, onFocusCell, onChange, onDelete, onToggleDone }) => {
  const dragControls = useDragControls()
  const completed = Boolean(set.completed)

  const handleGripPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragControls.start(event)
  }

  return (
    <Reorder.Item
      value={set.id}
      layout="position"
      dragControls={dragControls}
      dragListener={false}
      whileDrag={{ zIndex: "var(--layer-dragging)" }}
      className="set-grid set-row"
      data-done={completed}
      style={{ listStyle: "none", zIndex: "var(--layer-content)", position: "relative" }}
    >
      <span className="marker" data-current={isCurrent} />
      <span className="set-number">{index + 1}</span>
      {(["Reps", "Weight"] as CellKind[]).map(kind => (
        <PairInput
          key={kind}
          setId={`${set.id}`}
          kind={kind}
          planned={set[fieldName("planned", kind) as keyof GridSet] as number | null | undefined}
          actual={set[fieldName("actual", kind) as keyof GridSet] as number | null | undefined}
          activeSide={active?.kind === kind ? active.side : null}
          anyActive={anyActive && active?.kind === kind}
          showActual={isRoutine}
          onFocusSide={side => onFocusCell(kind, side)}
          onChange={(side, value) => onChange(set.id, fieldName(side, kind), value)}
        />
      ))}
      <input
        type="checkbox"
        aria-label="Warm-up set"
        checked={Boolean(set.isWarmup)}
        onChange={event => onChange(set.id, "isWarmup", event.target.checked)}
      />
      {isRoutine && (
        <DoneButton
          type="button"
          aria-label={completed ? "Mark set not done" : "Mark set done"}
          aria-pressed={completed}
          onClick={() => onToggleDone?.(set.id)}
        >
          <MdCheck />
        </DoneButton>
      )}
      <button type="button" className="icon-btn" aria-label={`Remove set ${index + 1}`} onClick={() => onDelete(set.id)}>
        <FaTrash />
      </button>
      <div className="grip" onPointerDown={handleGripPointerDown}>
        <LuGripVertical />
      </div>
    </Reorder.Item>
  )
}

// Solid accent button used for "Add set" / "Complete all" in both editors
export const GridButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: var(--radius-control);
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const Legend = styled.small`
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.65rem;
  color: var(--text-3);
`

const Grid = styled.div`
  font-size: 0.8rem;

  ul {
    padding-inline: 0;
    list-style: none;
    display: grid;
    gap: 0.4rem;
  }

  /* One column template for header and rows, so labels always line up with their cells */
  .set-grid {
    display: grid;
    grid-template-columns: 3px 1rem minmax(0, 1fr) minmax(0, 1.2fr) 1.3rem 1.6rem 1.3rem 1.3rem;
    align-items: center;
    gap: 0.4rem;
  }

  &[data-mode="template"] .set-grid {
    grid-template-columns: 3px 1rem minmax(0, 1fr) minmax(0, 1.2fr) 1.3rem 1.3rem 1.3rem;
  }

  .set-header-row span {
    font-size: 0.65rem;
    color: var(--text-3);
  }

  .set-row {
    padding-block: 0.15rem;
  }

  .set-row[data-done="true"] {
    background: var(--accent-soft);
  }

  .marker {
    align-self: stretch;
    background: transparent;
  }

  .marker[data-current="true"] {
    background: var(--accent);
  }

  .set-number {
    font-size: 0.7rem;
    color: var(--text-3);
    text-align: center;
  }

  input[type="checkbox"] {
    margin: 0;
    width: 1.2rem;
    height: 1.2rem;
  }

  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-3);
    font-size: 0.7rem;
    cursor: pointer;
  }

  .grip {
    display: inline-flex;
    justify-content: flex-end;
    color: var(--text-3);
    cursor: grab;
    touch-action: none;
    user-select: none;
    font-size: 1.1rem;
  }
`

const DoneButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  padding: 0;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: transparent;
  color: transparent;
  cursor: pointer;

  svg {
    font-size: 1.1rem;
  }

  &[aria-pressed="true"] {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-contrast);
  }
`
