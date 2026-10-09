import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { toggleFavouriteLocal } from "@root/store/slices/exercises/exercises.slice"
import { updateExerciseAction } from "@root/store/slices/exercises/exercises.thunks"
import { setSetsOrder, updateSet } from "@root/store/slices/routines/routines.slice"
import {
  addSetAction,
  saveMovementAction,
  updateMovementAction
} from "@root/store/slices/routines/routines.thunks"
import type { IDType, Movement } from "@root/types/data"
import { type FC, type MouseEvent, type PointerEvent, useEffect, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { MdAdd, MdCheck, MdClose } from "react-icons/md"
import { actualsFromPlan } from "./utils"
import { IoStar, IoStarOutline } from "react-icons/io5"
import { ButtonGroup, IconButton } from "../__shared/Button"
import { Stack } from "../__shared/layout/styled"
import { Text } from "../__shared/Typography"
import { ExerciseSelect } from "./ExerciseSelect"
import { SetRow } from "./SetRow"
import { SwitchToggle } from "./SwitchToggle"

import { Aside, CountIndicator, HeaderAction, Section, SetRepPanel } from "./styled"
import type { RootState } from "@root/store/store"
import styled from "styled-components"
import { LuGripVertical } from "react-icons/lu"
import { Reorder, useDragControls } from "motion/react"

export const MovementBlock: FC<{
  movement: Movement
  count: number
  isExpanded: boolean
  onOpenClick: (id: IDType | null) => void
  onCloseClick: () => void
  onDelete: (id: IDType) => void
}> = ({ movement, count, isExpanded = false, onOpenClick, onCloseClick, onDelete }) => {
  const dispatch = useAppDispatch()
  const dragControls = useDragControls()
  const exerciseList = useAppSelector(state => state.exercises.list)
  const movementId = movement.id as IDType
  const selectedExercise = exerciseList.find(exercise => exercise.id === movement.exerciseId)

  const [showActual, setShowActual] = useState(true)
  const sets = useAppSelector(
    (state: RootState) => state.routines.selected?.movements.find(m => m.id === movement.id)?.sets
  )

  const autosaveSignal = JSON.stringify({
    exerciseId: movement.exerciseId ?? null,
    sets: (sets || []).map(set => ({
      id: set.id,
      order: set.order,
      actualReps: set.actualReps,
      actualWeight: set.actualWeight,
      plannedReps: set.plannedReps,
      plannedWeight: set.plannedWeight,
      completed: Boolean(set.completed)
    }))
  })

  // Local state to manage changes to sets
  const handleShowActual = () => {
    setShowActual(prev => !prev)
  }

  const handleAddSet = async () => {
    await dispatch(addSetAction({ movementId, order: movement.sets.length }))
  }

  const handleOnDeleteRow = () => {}

  const handleOnExerciseSelect = (selected: IDType) => {
    dispatch(
      updateMovementAction({
        movementId,
        payload: { exerciseId: Number(selected) } // partial update
      })
    )
  }

  const stopEvent = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const handleGripPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragControls.start(event)
  }

  const handleToggleFavourite = async (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!selectedExercise) {
      return
    }

    dispatch(toggleFavouriteLocal(selectedExercise.id))

    try {
      await dispatch(
        updateExerciseAction({
          exerciseId: selectedExercise.id,
          payload: { favourite: !selectedExercise.favourite }
        })
      ).unwrap()
    } catch {
      dispatch(toggleFavouriteLocal(selectedExercise.id))
    }
  }

  const handleOpen = () => {
    if (isExpanded) {
      return
    }

    onOpenClick(movement.id as IDType)
  }

  const handleSetChange = (payload: { setId: IDType; field: string; value: number | boolean }) => {
    dispatch(updateSet({ movementId: movement.id, ...payload }))
  }

  const handleReorderSets = (setIds: IDType[]) => {
    dispatch(setSetsOrder({ movementId: movement.id as IDType, setIds }))
  }

  const orderedSets = [...(sets || [])].sort((left, right) => left.order - right.order)
  const currentSetId = orderedSets.find(set => !set.completed)?.id
  const allDone = orderedSets.length > 0 && orderedSets.every(set => set.completed)

  // Tick off every remaining set at its planned values, or untick all when everything is done
  const handleCompleteAll = () => {
    orderedSets.forEach(set => {
      if (allDone) {
        handleSetChange({ setId: set.id, field: "completed", value: false })
        return
      }
      if (set.completed) return
      Object.entries(actualsFromPlan(set)).forEach(([field, value]) =>
        handleSetChange({ setId: set.id, field, value })
      )
      handleSetChange({ setId: set.id, field: "completed", value: true })
    })
  }

  useEffect(() => {
    if (!isExpanded) {
      return
    }

    // Access signal to intentionally resubscribe autosave when edit payload changes.
    void autosaveSignal

    // Collect frequent edits and persist them with fewer network calls.
    const timeout = window.setTimeout(() => {
      dispatch(saveMovementAction(movement.id as number))
    }, 12000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [autosaveSignal, dispatch, isExpanded, movement.id])

  return (
    <Reorder.Item
      value={movement.id}
      layout="position"
      dragControls={dragControls}
      dragListener={false}
      whileDrag={{ zIndex: "var(--layer-dragging)" }}
      style={{
        listStyle: "none",
        zIndex: "var(--layer-content)",
        position: "relative"
      }}
    >
      <Section $isExpanded={isExpanded}>
        <Aside>
          <CountIndicator>
            <span>{count}</span>
          </CountIndicator>
          {/* {!isExpanded && ( */}
          <GripTarget onPointerDown={handleGripPointerDown}>
            <LuGripVertical />
          </GripTarget>
          {/* )} */}
        </Aside>

        {/** biome-ignore lint/a11y/noStaticElementInteractions: header toggles expansion and is pointer-targeted */}
        <header onClick={handleOpen}>
          <HeaderContent>
            <Stack>
              {!isExpanded && (
                <ExerciseHeader>
                  <Title>
                    <span>{exerciseList.find(m => m.id === movement.exerciseId)?.name || "-"}</span>
                    <SummaryText>{movement.summary ?? "-"}</SummaryText>
                  </Title>
                  <ButtonGroup $gap={0}>
                    <IconButton
                      onClick={event => {
                        stopEvent(event)
                        onDelete(movement.id as IDType)
                      }}
                      $fontSize="0.8rem"
                    >
                      <FaTrash />
                    </IconButton>
                  </ButtonGroup>
                </ExerciseHeader>
              )}
              {isExpanded && (
                <ExerciseSelect
                  movementId={movementId}
                  exerciseId={movement.exerciseId}
                  onChange={handleOnExerciseSelect}
                />
              )}
            </Stack>
          </HeaderContent>
        </header>
        {isExpanded && (
          <HeaderAction $isActive={isExpanded}>
            <ButtonGroup $gap={0.5}>
              <HeaderIconButton
                type="button"
                onClick={handleToggleFavourite}
                aria-label={
                  selectedExercise?.favourite ? "Remove from favourites" : "Add to favourites"
                }
                $isActive={Boolean(selectedExercise?.favourite)}
              >
                {selectedExercise?.favourite ? <IoStar /> : <IoStarOutline />}
              </HeaderIconButton>
              <IconButton
                onClick={event => {
                  stopEvent(event)
                  onCloseClick()
                }}
              >
                <MdClose />
              </IconButton>
            </ButtonGroup>
          </HeaderAction>
        )}
        <SetRepPanel $isExpanded={isExpanded}>
          {!sets?.length ? (
            <Text $align="left">No sets yet...</Text>
          ) : (
            <Reorder.Group
              axis="y"
              as="ul"
              values={orderedSets.map(set => set.id)}
              onReorder={handleReorderSets}
              style={{ padding: 0, margin: 0, overscrollBehaviorY: "contain" }}
            >
              <li className="set-grid set-header-row">
                <span>Sets</span>
                <span>Reps</span>
                <span>Weight</span>
                <span>WU</span>
                <span>Done</span>
                <span></span>
                <span></span>
              </li>
              {orderedSets.map(set => (
                <SetRow
                  key={set.id}
                  set={set}
                  movementId={movementId}
                  onFieldChange={handleSetChange}
                  showActual={showActual}
                  isCurrent={set.id === currentSetId}
                  onDelete={handleOnDeleteRow}
                />
              ))}
            </Reorder.Group>
          )}
          <ButtonGroup $gap={0.6} style={{ flexWrap: "wrap" }}>
            <AddRowButton type="button" onClick={handleAddSet}>
              <MdAdd />
              <span>Add Row</span>
            </AddRowButton>
            <AddRowButton type="button" onClick={handleCompleteAll} disabled={!orderedSets.length}>
              <MdCheck />
              <span>{allDone ? "Undo all" : "Complete all"}</span>
            </AddRowButton>
            <SwitchToggle
              isOn={showActual}
              onChange={handleShowActual}
              labels={{ on: "Logging: Planned", off: "Logging: Actual" }}
            />
          </ButtonGroup>
        </SetRepPanel>
      </Section>
    </Reorder.Item>
  )
}

const ExerciseHeader = styled.h2`
  /* // shared with select
  margin: 0;
  font-weight: 400;
  color: var(--text-2);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  > span {
    font-size: 1.4rem;
  } */
`

const SummaryText = styled.span`
  font-size: 0.8rem !important;
  color: var(--text-2);
`

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`

const HeaderIconButton = styled.button<{ $isActive: boolean }>`
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isActive }) => ($isActive ? "var(--warning)" : "var(--text-3)")};
  border: 0;
  background: transparent;
  border-radius: var(--radius-control);
  padding: 0;
  cursor: pointer;

  &:hover {
    background-color: var(--surface-elevated);
  }

  svg {
    font-size: 1rem;
  }
`

const GripTarget = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  color: var(--text-3);
  cursor: grab;
  margin-left: -0.1rem;
  flex: 1;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  svg {
    font-size: 1.4rem;
  }
`

const Title = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  /* 
  > span:first-child {
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--text-2);
  }    */
`

const AddRowButton = styled.button`
  font-size: 0.9rem;
  white-space: nowrap;
  font-weight: 500;

  background: var(--accent);
  color: var(--accent-contrast);
  padding: 0.3rem 0.8rem;

  border: none;
  border-radius: var(--radius-control);
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 0.2rem;

  transition: filter 0.2s;

  &:hover,
  &:active {
    filter: brightness(1.1);
  }
`
