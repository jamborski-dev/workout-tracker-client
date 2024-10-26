import { IconButton } from "@root/components/__shared/Button"
import { NameInput } from "@root/components/__shared/Form/NameInput"
import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { Page } from "@root/components/__shared/layout/Page"
import { Stack } from "@root/components/__shared/layout/styled"
import { RoutineUpdater } from "@root/components/RoutineUpdater/RoutineUpdater"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import {
  selectRoutinesLoading,
  selectRoutine
} from "@root/store/slices/routines/routines.selectors"
import {
  getRoutineByIdAction,
  updateRoutineAction
} from "@root/store/slices/routines/routines.thunks"
import { formatDate } from "@root/utils/date"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { MdCheck, MdClose, MdModeEdit } from "react-icons/md"
import { useParams } from "react-router-dom"
import styled from "styled-components"

const DEFAULT_ROUTINE_NAME = "New Routine"
const userId = 1 // mock

const RoutineById = () => {
  const [isInEditMode, setIsInEditMode] = useState(false)
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectRoutinesLoading)
  const routine = useAppSelector(selectRoutine)

  const methods = useForm()
  const { handleSubmit, setError } = methods

  const getRoutine = async () => {
    if (!userId || !id) {
      console.info("No user or routine id")
      return
    }

    await dispatch(getRoutineByIdAction({ userId, routineId: id }))
  }

  const handleEditTitle = () => {
    setIsInEditMode(true)
  }

  const handleSaveTitle = () => {
    handleSubmit(onSubmit)()
    setIsInEditMode(false)
  }

  const handleCancelEdit = () => {
    setIsInEditMode(false)
  }

  const onSubmit = async (data: Record<string, string | number>) => {
    try {
      console.log(data)
      const action = await dispatch(updateRoutineAction({ userId, routineId: id!, payload: data }))

      if (action.type === "updateRoutineAction/fulfilled") {
        setIsInEditMode(false)
        return
      }

      if (action.type === "updateRoutineAction/rejected") {
        setError("name", {
          type: "manual",
          message: "Failed to update routine"
        })
      }
    } catch (error) {
      console.error("Failed to update routine", error)
      setError("name", {
        type: "manual",
        message: "Failed to update routine"
      })
    }
  }

  useEffect(() => {
    if (!id) return
    getRoutine()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!routine) {
    return <p>No routine found</p>
  }

  const date = formatDate(routine.date)

  return (
    <Page
      headerComponent={
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              {date.day}
              <sup>{date.getOrdinalSuffix}</sup> {date.month} {date.year}
            </div>
            <Stack>
              {isInEditMode ? (
                <NameContainer>
                  <NameInput id={"name"} defaultValue={routine?.name} />
                  <IconButton onClick={handleSaveTitle}>
                    <MdCheck />
                  </IconButton>
                  <IconButton onClick={handleCancelEdit}>
                    <MdClose />
                  </IconButton>
                </NameContainer>
              ) : (
                <NameContainer>
                  <h4>{routine?.name || DEFAULT_ROUTINE_NAME}</h4>
                  <IconButton onClick={handleEditTitle}>
                    <MdModeEdit />
                  </IconButton>
                </NameContainer>
              )}
            </Stack>
          </form>
        </FormProvider>
      }
      footerComponent={<> footer </>}
    >
      <RoutineUpdater />
    </Page>
  )
}

export default RoutineById

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transform: translateX(1rem);
`
