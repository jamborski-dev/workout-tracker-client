import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { toggleFavouriteLocal } from "@root/store/slices/exercises/exercises.slice"
import { updateExerciseAction } from "@root/store/slices/exercises/exercises.thunks"
import { setMovementSetup, setSetsOrder, updateSet } from "@root/store/slices/routines/routines.slice"
import {
  addSetAction,
  removeSetAction,
  saveMovementAction,
  updateMovementAction
} from "@root/store/slices/routines/routines.thunks"
import { getLastSets } from "@root/services/exercises.service"
import type { IDType, Movement } from "@root/types/data"
import { type FC, type MouseEvent, type PointerEvent, useEffect } from "react"
import { FaTrash } from "react-icons/fa6"
import { MdAdd, MdCheck, MdClose } from "react-icons/md"
import { actualsFromPlan, buildSummary } from "./utils"
import { IoStar, IoStarOutline } from "react-icons/io5"
import { ButtonGroup, IconButton } from "../__shared/Button"
import { Stack } from "../__shared/layout/styled"
import { Text } from "../__shared/Typography"
import { ExercisePicker } from "../ExercisePicker/ExercisePicker"
import { SetupField } from "../ExercisePicker/SetupField"
import { GridButton, SetGrid } from "../SetGrid/SetGrid"

import { Aside, CountIndicator, HeaderAction, Section, SetRepPanel } from "./styled"
import type { RootState } from "@root/store/store"
import { selectPreferredCategories } from "@root/store/slices/routines/routines.selectors"
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
  const preferredCategories = useAppSelector(selectPreferredCategories)
  const movementId = movement.id as IDType
  const selectedExercise = exerciseList.find(exercise => exercise.id === movement.exerciseId)

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
      completed: Boolean(set.completed),
      isWarmup: Boolean(set.isWarmup)
    })),
    setup: movement.setup ?? null
  })

  const handleAddSet = async () => {
    await dispatch(addSetAction({ movementId, order: movement.sets.length }))
  }

  // Picking an exercise on an empty movement prefills the plan with what was done last time
  const handleOnExerciseSelect = async (selected: IDType) => {
    dispatch(updateMovementAction({ movementId, payload: { exerciseId: Number(selected) } }))

    const isBlank = (movement.sets ?? []).every(
      set =>
        [set.plannedReps, set.plannedWeight, set.actualReps, set.actualWeight].every(value => value == null) &&
        !set.completed
    )
    if (!isBlank) return

    try {
      const last = await getLastSets(selected)
      if (!last?.sets.length) return

      if (last.setup && !movement.setup) dispatch(setMovementSetup({ movementId, setup: last.setup }))
      const ids = (movement.sets ?? []).map(set => set.id)
      while (ids.length < last.sets.length) {
        const created = await dispatch(addSetAction({ movementId, order: ids.length })).unwrap()
        ids.push(created.id)
      }
      last.sets.forEach((set, index) => {
        handleSetChange(ids[index], "plannedReps", set.reps)
        handleSetChange(ids[index], "plannedWeight", set.weight)
        if (set.isWarmup) handleSetChange(ids[index], "isWarmup", true)
      })
    } catch {
      // prefill is a convenience; the toast already reports real failures
    }
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

  const handleSetChange = (setId: IDType, field: string, value: number | boolean | null) => {
    dispatch(updateSet({ movementId: movement.id, setId, field, value }))
  }

  const handleRemoveSet = (setId: IDType) => {
    dispatch(removeSetAction({ setId, movementId }))
  }

  // Tick a set off: empty actuals are filled from the plan; ticking again undoes the tick only
  const handleToggleDone = (setId: IDType) => {
    const set = orderedSets.find(item => item.id === setId)
    if (!set) return
    if (!set.completed) {
      Object.entries(actualsFromPlan(set)).forEach(([field, value]) => handleSetChange(setId, field, value))
    }
    handleSetChange(setId, "completed", !set.completed)
  }

  const handleReorderSets = (setIds: IDType[]) => {
    dispatch(setSetsOrder({ movementId: movement.id as IDType, setIds }))
  }

  const orderedSets = [...(sets || [])].sort((left, right) => left.order - right.order)
  const allDone = orderedSets.length > 0 && orderedSets.every(set => set.completed)

  // Tick off every remaining set at its planned values, or untick all when everything is done
  const handleCompleteAll = () => {
    orderedSets.forEach(set => {
      if (allDone) {
        handleSetChange(set.id, "completed", false)
        return
      }
      if (set.completed) return
      Object.entries(actualsFromPlan(set)).forEach(([field, value]) =>
        handleSetChange(set.id, field, value)
      )
      handleSetChange(set.id, "completed", true)
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
    }, 2000)

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
                    <SummaryText>{buildSummary(orderedSets)}</SummaryText>
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
                <PickerStack>
                  <ExercisePicker
                    exerciseId={movement.exerciseId}
                    preferredCategories={preferredCategories}
                    onSelect={handleOnExerciseSelect}
                  />
                  <SetupField
                    value={movement.setup}
                    onChange={setup => dispatch(setMovementSetup({ movementId, setup }))}
                  />
                </PickerStack>
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
          {!isExpanded ? null : !sets?.length ? (
            <Text $align="left">No sets yet...</Text>
          ) : (
            <SetGrid
              mode="routine"
              showLegend={isExpanded}
              weightPerSide={Boolean(selectedExercise?.weightPerSide)}
              title={selectedExercise?.name ?? "Exercise"}
              sets={orderedSets}
              onChange={handleSetChange}
              onDelete={handleRemoveSet}
              onReorder={handleReorderSets}
              onToggleDone={handleToggleDone}
            />
          )}
          {isExpanded && (
            <ButtonGroup $gap={0.6} style={{ flexWrap: "wrap" }}>
              <GridButton type="button" onClick={handleAddSet}>
                <MdAdd />
                <span>Add set</span>
              </GridButton>
              <GridButton type="button" onClick={handleCompleteAll} disabled={!orderedSets.length}>
                <MdCheck />
                <span>{allDone ? "Undo all" : "Complete all"}</span>
              </GridButton>
            </ButtonGroup>
          )}
        </SetRepPanel>
      </Section>
    </Reorder.Item>
  )
}

const PickerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
`

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
