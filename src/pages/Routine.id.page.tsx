import { IconButton } from "@root/components/__shared/Button"
import { DateInput } from "@root/components/__shared/Form/DateInput"
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
  const [editTitle, setEditTitle] = useState(false)
  const [editDate, setEditDate] = useState(false)
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

    await dispatch(getRoutineByIdAction({ routineId: id }))
  }

  const handleEditTitle = () => {
    setEditTitle(true)
  }

  const handleEditDate = () => {
    setEditDate(true)
  }

  const handleSave = () => {
    handleSubmit(onSubmit)()
    handleDismissEdit()
  }

  const handleDismissEdit = () => {
    if (editTitle) {
      setEditTitle(false)
      return
    }

    if (editDate) {
      setEditDate(false)
      return
    }
  }

  const onSubmit = async (data: Record<string, string | number>) => {
    try {
      const action = await dispatch(updateRoutineAction({ payload: data }))

      if (action.type === "updateRoutineAction/fulfilled") {
        handleDismissEdit()
        return
      }

      if (action.type === "updateRoutineAction/rejected") {
        setError(editTitle ? "name" : "date", {
          type: "manual",
          message: "Failed to update routine"
        })
      }
    } catch (error) {
      console.error("Failed to update routine", error)
      setError(editTitle ? "name" : "date", {
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
            {editDate ? (
              <EditableContentContainer>
                <DateContainer>
                  <DateInput id="date" defaultValue={routine?.date} />
                </DateContainer>
                <IconButton onClick={handleSave}>
                  <MdCheck />
                </IconButton>
                <IconButton onClick={handleDismissEdit}>
                  <MdClose />
                </IconButton>
              </EditableContentContainer>
            ) : (
              <EditableContentContainer>
                <div>
                  {date.day}
                  <sup>{date.getOrdinalSuffix}</sup> {date.month} {date.year}
                </div>
                <IconButton onClick={handleEditDate}>
                  <MdModeEdit />
                </IconButton>
              </EditableContentContainer>
            )}
            <Stack>
              {editTitle ? (
                <EditableContentContainer>
                  <NameInput id={"name"} defaultValue={routine?.name} />
                  <IconButton onClick={handleSave}>
                    <MdCheck />
                  </IconButton>
                  <IconButton onClick={handleDismissEdit}>
                    <MdClose />
                  </IconButton>
                </EditableContentContainer>
              ) : (
                <EditableContentContainer>
                  <h4>{routine?.name || DEFAULT_ROUTINE_NAME}</h4>
                  <IconButton onClick={handleEditTitle}>
                    <MdModeEdit />
                  </IconButton>
                </EditableContentContainer>
              )}
            </Stack>
          </form>
        </FormProvider>
      }
    >
      <RoutineUpdater />
    </Page>
  )
}

export default RoutineById

const EditableContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transform: translateX(1rem);
`

const DateContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  transform: translateX(1rem);
`
