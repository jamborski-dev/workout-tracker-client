import styled from "styled-components"
import { MovementBlock } from "./MovementBlock"
import { IDType, Movement } from "@root/types/data"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectOpenMovementId, selectRoutine } from "@root/store/slices/routines/routines.selectors"
import { Text } from "@root/components/__shared/Typography"
import { FormProvider, useForm } from "react-hook-form"
import {
  addMovementAction,
  removeMovementAction,
  saveMovementAction
} from "@root/store/slices/routines/routines.thunks"
import { closeMovement, editMovement } from "@root/store/slices/routines/routines.slice"

export const RoutineUpdater = () => {
  const dispatch = useAppDispatch()
  const routine = useAppSelector(selectRoutine)
  const movements = useAppSelector(state => state.routines.selected?.movements)
  const timerId = useAppSelector(state => state.app.uuid)
  const panelId = useAppSelector(selectOpenMovementId)
  const methods = useForm()

  if (!routine)
    return (
      <div>
        <Text>No routine found</Text>
      </div>
    )

  const handleEditClick = (id: IDType | null) => {
    if (timerId && panelId) {
      dispatch(saveMovementAction(panelId))
    }

    dispatch(editMovement(id))
  }

  const handleCloseMovement = () => {
    if (timerId && panelId) {
      dispatch(saveMovementAction(panelId))
    }

    dispatch(closeMovement())
  }

  const handleAddMovement = () => {
    dispatch(addMovementAction({ order: movements?.length || 0 }))
  }

  const handleRemoveMovement = (id: IDType) => {
    dispatch(removeMovementAction({ movementId: id }))
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => console.log("Submit"))}>
        {!movements?.length ? (
          <Text>Add movements to start your routine...</Text>
        ) : (
          movements.map((movement: Movement, index: number) => (
            <MovementBlock
              key={index}
              movement={movement}
              count={index + 1}
              isExpanded={panelId === movement.id}
              onEditClick={handleEditClick}
              onCloseClick={handleCloseMovement}
              onDelete={handleRemoveMovement}
            />
          ))
        )}
        <Footer>
          <AddMovement onClick={handleAddMovement}>
            <div>
              <span>+</span>
            </div>
            <div>Add Movement</div>
          </AddMovement>
        </Footer>
      </form>
    </FormProvider>
  )
}

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  padding-block: 1rem;
  border-top: 1px solid #e6e6e6;
`

const AddMovement = styled.button`
  background: none;
  border: none;
  padding-block: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  div:first-child {
    background: #f1f1f1;
    border: none;
    border-radius: 1000px;
    width: 1.7rem;
    height: 1.7rem;
    color: #616161;
    position: relative;

    span {
      position: absolute;
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.4rem;
    }

    &:hover {
      background: #e6e6e6;
    }
  }
  div:last-child {
    font-size: 0.9rem;
  }
`
