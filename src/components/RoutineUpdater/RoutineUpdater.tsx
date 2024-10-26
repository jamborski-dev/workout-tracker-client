import styled from "styled-components"
import { MovementBlock } from "./MovementBlock"
import { useState } from "react"
import { IDType, Movement } from "@root/types/data"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectRoutine } from "@root/store/slices/routines/routines.selectors"
import { Text } from "@root/components/__shared/Typography"
import { FormProvider, useForm } from "react-hook-form"
import { FixMeLater } from "@root/types/FixMeLater"
import {
  addMovementAction,
  removeMovementAction
} from "@root/store/slices/routines/routines.thunks"

const userId = 1

export const RoutineUpdater = () => {
  const dispatch = useAppDispatch()
  const routine = useAppSelector(selectRoutine)
  const [expandedPanelId, setExpandedPanelId] = useState<IDType | null>(null)
  const methods = useForm()

  if (!routine)
    return (
      <div>
        <Text>No routine found</Text>
      </div>
    )

  const handleEditClick = (value: IDType | null) => {
    setExpandedPanelId(value)
  }

  const handleAddMovement = () => {
    dispatch(addMovementAction({ userId, routineId: routine.id, order: routine.movements.length }))
  }

  const handleRemoveMovement = (id: IDType) => {
    dispatch(removeMovementAction({ userId, routineId: routine.id, movementId: id }))
  }

  const onSubmit = (data: FixMeLater) => {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {!routine.movements?.length ? (
          <Text>Add movements to start your routine...</Text>
        ) : (
          routine.movements.map((movement: Movement, index: number) => (
            <MovementBlock
              key={index}
              movement={movement}
              count={index + 1}
              isExpanded={expandedPanelId === movement.id}
              onEditClick={handleEditClick}
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
