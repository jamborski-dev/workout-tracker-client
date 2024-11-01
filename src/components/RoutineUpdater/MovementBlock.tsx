import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { reorderMovements, updateSet } from "@root/store/slices/routines/routines.slice"
import {
  addSetAction,
  saveMovementAction,
  updateMovementAction
} from "@root/store/slices/routines/routines.thunks"
import { IDType, Movement } from "@root/types/data"
import { FC, useCallback, useEffect, useState } from "react"
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
import { RootState } from "@root/store/store"
import debounce from "lodash.debounce"

export const MovementBlock: FC<{
  movement: Movement
  count: number
  isExpanded: boolean
  onEditClick: (id: IDType | null) => void
  onCloseClick: () => void
  onDelete: (id: IDType) => void
}> = ({ movement, count, isExpanded = false, onEditClick, onCloseClick, onDelete }) => {
  const dispatch = useAppDispatch()
  const timerId = useAppSelector((state: RootState) => state.app.uuid)
  const exerciseList = useAppSelector(state => state.exercises.list)

  const [showActual, setShowActual] = useState(true)
  const sets = useAppSelector(
    (state: RootState) => state.routines.selected?.movements.find(m => m.id === movement.id)?.sets
  )

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

  const debouncedSaveAction = useCallback(
    debounce(() => {
      dispatch(saveMovementAction(movement.id as number))
    }, 5000),
    [dispatch, movement.id, timerId]
  )

  useEffect(() => {
    if (isExpanded) {
      // Trigger the save action whenever timerId changes to collect for batch partial updates
      debouncedSaveAction()
    } else {
      debouncedSaveAction.cancel()
    }

    return () => {
      // Cancel the debounce when component unmounts or timerId changes
      debouncedSaveAction.cancel()
    }
  }, [debouncedSaveAction, isExpanded, dispatch, movement.id])

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
            <h2>
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
            </h2>
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
            {sets.map((set, index) => (
              <SetRow
                key={index}
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
          <button className="add-set" onClick={handleAddSet}>
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
