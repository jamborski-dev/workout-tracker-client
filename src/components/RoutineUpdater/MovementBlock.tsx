import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { resetTimer, startTimer } from "@root/store/slices/app/app.slice"
import { updateMovementSummary } from "@root/store/slices/routines/routines.slice"
import {
  addSetAction,
  updateManySetsAction,
  updateMovementAction
} from "@root/store/slices/routines/routines.thunks"
import { IDType, Movement, MovementSet, UpdateManySetsServicePayload } from "@root/types/data"
import debounce from "lodash.debounce"
import { FC, useCallback, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { MdAdd, MdClose, MdModeEdit } from "react-icons/md"
import { ButtonGroup, IconButton } from "../__shared/Button"
import { Stack } from "../__shared/layout/styled"
import { Text } from "../__shared/Typography"
import { ExerciseSelect } from "./ExerciseSelect"
import { exerciseList } from "./mock-data"
import { SetRow } from "./SetRow"
import { SwitchToggle } from "./SwitchToggle"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

import { v4 as uuid } from "uuid"
import { Aside, CountIndicator, HeaderAction, Section, SetRepPanel } from "./styled"
import { buildSummary, mergePayload } from "./utils"

const userId = 1
const routineId = 1

export const MovementBlock: FC<{
  movement: Movement
  count: number
  isExpanded: boolean
  onEditClick: (id: IDType | null) => void
  onDelete: (id: IDType) => void
}> = ({ movement, count, isExpanded = false, onEditClick, onDelete }) => {
  const dispatch = useAppDispatch()
  const timerId = useAppSelector(state => state.app.uuid)
  const [showActual, setShowActual] = useState(true)

  // Local state to manage changes to sets
  const [updatePayload, setUpdatePayload] = useState<MovementSet[]>([])

  const handleShowActual = () => {
    setShowActual(prev => !prev)
  }

  const handleAddSet = async () => {
    await dispatch(
      addSetAction({ userId, routineId, movementId: movement.id!, order: movement.sets.length })
    )
  }

  const handleOnDeleteRow = () => {}

  const handleOnExerciseSelect = (selected: IDType) => {
    dispatch(
      updateMovementAction({
        userId: 1, // get from state later
        routineId: 1, // get from state later
        movementId: movement.id!,
        payload: { exerciseId: parseInt(selected as string) } // partial update
      })
    )
  }

  // TODO implement this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReorderUp = () => {
    // dispatch(
    //   updateMovementAction({
    //     userId: 1, // get from state later
    //     routineId: 1, // get from state later
    //     movementId: movement.id!,
    //     payload: { order: count - 1 } // partial update
    //   })
  }

  const handleSetChange = (setId: IDType, field: string, value: number) => {
    console.log("handleSetChange", value)
    // Update local state for immediate UI response
    const payload = getTransformedPayloadObject(setId, field, value)
    const summary = buildSummary(mergePayload(movement.sets, payload))
    dispatch(updateMovementSummary({ movementId: movement.id!, summary }))

    setUpdatePayload(payload)

    // Start the timer
    dispatch(startTimer({ payload: 4000, meta: { requestId: uuid() } }))

    // Trigger debounced update for the backend
    debouncedUpdateSet({
      sets: payload,
      summary
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debouncedUpdateSet = useCallback(
    debounce((updatedValues: UpdateManySetsServicePayload) => {
      console.log("debouncedUpdateSet")
      dispatch(
        updateManySetsAction({
          userId,
          routineId,
          movementId: movement.id,
          payload: updatedValues
        })
      )

      // Reset the timer
      dispatch(resetTimer())
    }, 5000), // wait 5 seconds before sending request
    [dispatch, userId, routineId, timerId]
  )

  const getTransformedPayloadObject = (
    setId: IDType,
    field: string,
    value: number
  ): MovementSet[] => {
    const transformedField = field.split(".")[2]

    // find if the set exists in the local state
    const set = updatePayload.find(set => set.id === setId)

    // if it exists, update the field
    if (set) {
      return updatePayload.map(set => {
        if (set.id === setId) {
          return {
            ...set,
            [transformedField]: value
          }
        }
        return set
      })
    }

    // get order variable from the set of id setId
    const order = movement.sets.find(set => set.id === setId)?.order || movement.sets.length

    // if not found, create a new set with the updated field
    return [
      ...updatePayload,
      {
        id: setId,
        order,
        [transformedField]: value
      }
    ]
  }

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
              {exerciseList.find(m => m.id === movement.exerciseId)?.name || "-"}
              <ButtonGroup $gap={0.5}>
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
          <ButtonGroup $direction="column">
            <IconButton onClick={() => onEditClick(null)}>
              <MdClose />
            </IconButton>
            {/* TODO implement logic */}
            <IconButton onClick={handleReorderUp}>
              <IoIosArrowUp />
            </IconButton>
            <IconButton onClick={handleReorderUp}>
              <IoIosArrowDown />
            </IconButton>
          </ButtonGroup>
        </HeaderAction>
      )}
      <SetRepPanel $isExpanded={isExpanded}>
        {!movement.sets.length ? (
          <Text $align="left">No sets yet...</Text>
        ) : (
          <ul>
            <li>
              <span>Reps</span>
              <span>Weight</span>
              <span></span>
            </li>
            {movement.sets.map((set, index) => (
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
