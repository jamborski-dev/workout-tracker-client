import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { reorderMovements, updateSet } from "@root/store/slices/routines/routines.slice"
import {
  addSetAction,
  saveMovementAction,
  updateMovementAction
} from "@root/store/slices/routines/routines.thunks"
import type { IDType, Movement } from "@root/types/data"
import { type FC, useEffect, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { MdAdd, MdClose, MdModeEdit, MdSave } from "react-icons/md"
import { ButtonGroup, IconButton } from "../__shared/Button"
import { Stack } from "../__shared/layout/styled"
import { Text } from "../__shared/Typography"
import { ExerciseSelect } from "./ExerciseSelect"
import { SetRow } from "./SetRow"
import { SwitchToggle } from "./SwitchToggle"

import { Aside, CountIndicator, HeaderAction, Section, SetRepPanel } from "./styled"
import type { RootState } from "@root/store/store"
import styled from "styled-components"

export const MovementBlock: FC<{
  movement: Movement
  count: number
  isExpanded: boolean
  onEditClick: (id: IDType | null) => void
  onCloseClick: () => void
  onDelete: (id: IDType) => void
}> = ({ movement, count, isExpanded = false, onEditClick, onCloseClick, onDelete }) => {
  const dispatch = useAppDispatch()
  const exerciseList = useAppSelector(state => state.exercises.list)

  const [showActual, setShowActual] = useState(true)
  const sets = useAppSelector(
    (state: RootState) => state.routines.selected?.movements.find(m => m.id === movement.id)?.sets
  )

  const autosaveSignal = JSON.stringify({
    exerciseId: movement.exerciseId ?? null,
    sets: (sets || []).map(set => ({
      id: set.id,
      actualReps: set.actualReps,
      actualWeight: set.actualWeight,
      plannedReps: set.plannedReps,
      plannedWeight: set.plannedWeight
    }))
  })

  const canMoveUp = movement.order > 0

  // TODO move to .selectors
  const canMoveDown = useAppSelector((state: RootState) => {
    const movements = state.routines.selected?.movements ?? []
    const maxOrder = movements.length - 1
    return movement.order < maxOrder
  })

  // Local state to manage changes to sets
  const handleShowActual = () => {
    setShowActual(prev => !prev)
  }

  const handleAddSet = async () => {
    await dispatch(addSetAction({ movementId: movement.id!, order: movement.sets.length }))
  }

  const handleOnDeleteRow = () => {}

  const handleOnExerciseSelect = (selected: IDType) => {
    dispatch(
      updateMovementAction({
        movementId: movement.id!,
        payload: { exerciseId: parseInt(selected as string) } // partial update
      })
    )
  }

  const handleReorderUp = () => {
    dispatch(reorderMovements({ movementId: movement.id as number, direction: "up" }))
  }

  const handleReorderDown = () => {
    dispatch(reorderMovements({ movementId: movement.id as number, direction: "down" }))
  }

  const onSaveClick = () => {
    dispatch(saveMovementAction(movement.id as number))
  }

  const handleSetChange = (payload: { setId: IDType; field: string; value: number }) => {
    dispatch(updateSet({ movementId: movement.id, ...payload }))
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
    <Section $isExpanded={isExpanded}>
      <Aside>
        <CountIndicator>
          <span>{count}</span>
        </CountIndicator>
      </Aside>

      <header>
        <Stack>
          {!isExpanded && (
            <ExerciseHeader>
              <span>{exerciseList.find(m => m.id === movement.exerciseId)?.name || "-"}</span>
              <ButtonGroup $gap={0}>
                <IconButton onClick={handleReorderUp} disabled={!canMoveUp}>
                  <IoIosArrowUp />
                </IconButton>
                <IconButton onClick={handleReorderDown} disabled={!canMoveDown}>
                  <IoIosArrowDown />
                </IconButton>
                <IconButton onClick={() => onEditClick(movement.id!)}>
                  <MdModeEdit />
                </IconButton>
                <IconButton onClick={() => onDelete(movement.id!)} $fontSize="0.8rem">
                  <FaTrash />
                </IconButton>
              </ButtonGroup>
            </ExerciseHeader>
          )}
          {isExpanded && (
            <ExerciseSelect
              movementId={movement.id!}
              exerciseId={movement.exerciseId}
              onChange={handleOnExerciseSelect}
            />
          )}
        </Stack>
        <span>{movement.summary ?? "-"}</span>
      </header>
      {isExpanded && (
        <HeaderAction $isActive={isExpanded}>
          <ButtonGroup $gap={0.5}>
            <IconButton onClick={() => onSaveClick()}>
              <MdSave />
            </IconButton>
            <IconButton onClick={() => onCloseClick()}>
              <MdClose />
            </IconButton>
          </ButtonGroup>
        </HeaderAction>
      )}
      <SetRepPanel $isExpanded={isExpanded}>
        {!sets?.length ? (
          <Text $align="left">No sets yet...</Text>
        ) : (
          <ul>
            <li>
              <span>Reps</span>
              <span>Weight</span>
              <span></span>
            </li>
            {sets.map(set => (
              <SetRow
                key={set.id}
                set={set}
                movementId={movement.id!}
                onFieldChange={handleSetChange}
                showActual={showActual}
                onDelete={handleOnDeleteRow}
              />
            ))}
          </ul>
        )}
        <ButtonGroup>
          <button type="button" className="add-set" onClick={handleAddSet}>
            <MdAdd />
            <span>Add Set</span>
          </button>
          <SwitchToggle
            isOn={showActual}
            onChange={handleShowActual}
            labels={{ on: "Planned", off: "Actual" }}
          />
        </ButtonGroup>
      </SetRepPanel>
    </Section>
  )
}

const ExerciseHeader = styled.h2`
  /* // shared with select
  margin: 0;
  font-weight: 400;
  color: #616161;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  > span {
    font-size: 1.4rem;
  } */
`
