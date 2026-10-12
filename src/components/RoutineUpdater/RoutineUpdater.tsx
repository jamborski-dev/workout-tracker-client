import styled from "styled-components"
import { MovementBlock } from "./MovementBlock"
import type { IDType, Movement } from "@root/types/data"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectOpenMovementId, selectRoutine } from "@root/store/slices/routines/routines.selectors"
import { Text } from "@root/components/__shared/Typography"
import { FormProvider, useForm } from "react-hook-form"
import {
  addMovementAction,
  deleteMovementAction,
  saveMovementAction
} from "@root/store/slices/routines/routines.thunks"
import {
  closeMovement,
  editMovement,
  setMovementsOrder
} from "@root/store/slices/routines/routines.slice"
import { useCallback, useEffect, useRef } from "react"
import { getAllExercisesAction } from "@root/store/slices/exercises/exercises.thunks"
import { MdAdd } from "react-icons/md"
import { Reorder } from "motion/react"
import { useTranslation } from "react-i18next"

export const RoutineUpdater = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const routine = useAppSelector(selectRoutine)
  const movements = useAppSelector(state => state.routines.selected?.movements)
  const panelId = useAppSelector(selectOpenMovementId)
  const autoBootstrapDoneByRoutineId = useRef<Record<string, boolean>>({})
  const autoBootstrapRequestedByRoutineId = useRef<Record<string, boolean>>({})
  const methods = useForm()

  const flushOpenMovement = () => {
    if (panelId) {
      dispatch(saveMovementAction(panelId))
    }
  }

  const handleOpenMovement = (id: IDType | null) => {
    flushOpenMovement()

    if (id) {
      dispatch(saveMovementAction(id))
    }

    dispatch(editMovement(id))
  }

  const handleCloseMovement = () => {
    flushOpenMovement()

    dispatch(closeMovement())
  }

  const handleAddMovement = () => {
    flushOpenMovement()
    dispatch(addMovementAction({ order: movements?.length || 0 }))
  }

  const handleRemoveMovement = (id: IDType) => {
    flushOpenMovement()
    dispatch(deleteMovementAction({ movementId: id }))
  }

  const handleReorderMovements = (movementIds: IDType[]) => {
    dispatch(setMovementsOrder(movementIds))
  }

  const getExercises = useCallback(async () => {
    await dispatch(getAllExercisesAction())
  }, [dispatch])

  useEffect(() => {
    getExercises()
  }, [getExercises])

  useEffect(() => {
    if (!routine || !movements) {
      return
    }

    const routineId = `${routine.id}`
    if (autoBootstrapDoneByRoutineId.current[routineId]) {
      return
    }

    if (movements.length === 0) {
      if (autoBootstrapRequestedByRoutineId.current[routineId]) {
        return
      }
      autoBootstrapRequestedByRoutineId.current[routineId] = true
      dispatch(addMovementAction({ order: 0 }))
      return
    }

    dispatch(editMovement(movements[0].id))
    autoBootstrapDoneByRoutineId.current[routineId] = true
    autoBootstrapRequestedByRoutineId.current[routineId] = false
  }, [dispatch, movements, routine])

  if (!routine)
    return (
      <div>
        <Text>{t("updater.notFound")}</Text>
      </div>
    )

  return (
    <FormProvider {...methods}>
      <StyledForm onSubmit={methods.handleSubmit(() => console.log("Submit"))}>
        {!movements?.length ? (
          <Text>{t("updater.empty")}</Text>
        ) : (
          <Reorder.Group
            axis="y"
            values={movements.map(movement => movement.id)}
            onReorder={handleReorderMovements}
            style={{
              padding: 0,
              margin: 0,
              overscrollBehaviorY: "contain"
            }}
          >
            {movements.map((movement: Movement, index: number) => (
              <MovementBlock
                key={movement.id}
                movement={movement}
                count={index + 1}
                isExpanded={panelId === movement.id}
                onOpenClick={handleOpenMovement}
                onCloseClick={handleCloseMovement}
                onDelete={handleRemoveMovement}
              />
            ))}
          </Reorder.Group>
        )}
        <Footer>
          <AddMovement type="button" onClick={handleAddMovement}>
            <div>
              <MdAdd />
            </div>
            <div>{t("updater.addMovement")}</div>
          </AddMovement>
        </Footer>
      </StyledForm>
    </FormProvider>
  )
}

const StyledForm = styled.form`
  > ul {
    padding: 0;
    margin: 0;
  }
`

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  padding-block: 1rem;
  border-top: 1px solid var(--border-subtle);
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
    background: var(--surface-elevated);
    border: none;
    border-radius: 1000px;
    width: 1.7rem;
    height: 1.7rem;
    color: var(--text-2);
    position: relative;

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.4rem;
    }

    &:hover {
      background: var(--surface-overlay);
    }
  }
  div:last-child {
    font-size: 0.9rem;
  }
`
