import { IconButton } from "@root/components/__shared/Button"
import { DateInput } from "@root/components/__shared/Form/DateInput"
import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { Page } from "@root/components/__shared/layout/Page"
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
import { getAllRoutineTypesAction } from "@root/store/slices/routineTypes/routineTypes.thunks"
import { selectRoutineTypes as selectRoutineTypesList } from "@root/store/slices/routineTypes/routineTypes.selectors"
import type { IDType } from "@root/types/data"
import { formatDate } from "@root/utils/date"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { MdCheck, MdChevronLeft, MdClose, MdModeEdit } from "react-icons/md"
import Select, { type SingleValue } from "react-select"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { baseSelectStyles } from "@root/components/_forms/CustomSelectStyles"

type RoutineTypeOption = {
  label: string
  value: IDType
  name: string
}

const RoutineById = () => {
  const [editDate, setEditDate] = useState(false)
  const [selectedRoutineTypeOption, setSelectedRoutineTypeOption] =
    useState<RoutineTypeOption | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectRoutinesLoading)
  const routine = useAppSelector(selectRoutine)
  const routineTypes = useAppSelector(selectRoutineTypesList)
  const userId = useAppSelector(state => state.auth.user?.id)

  const methods = useForm()
  const { handleSubmit, setError } = methods
  const selectMenuPortalTarget = typeof document !== "undefined" ? document.body : null

  const routineTypeOptions: RoutineTypeOption[] = useMemo(
    () =>
      routineTypes.map(item => ({
        value: item.id,
        label: item.name,
        name: item.name
      })),
    [routineTypes]
  )

  const routineTypeId = routine?.routineTypeId
  const routineTypeName =
    typeof routine?.routineType === "string"
      ? routine.routineType
      : routine?.routineType?.name || undefined

  const resolvedRoutineType = useMemo(
    () =>
      routineTypeOptions.find(option => `${option.value}` === `${routineTypeId}`) ||
      routineTypeOptions.find(option => option.name === routineTypeName) ||
      (routineTypeName
        ? {
            value: routineTypeId || routineTypeName,
            label: routineTypeName,
            name: routineTypeName
          }
        : null),
    [routineTypeId, routineTypeName, routineTypeOptions]
  )

  const selectedRoutineType = selectedRoutineTypeOption || resolvedRoutineType

  const handleEditDate = () => {
    setEditDate(true)
  }

  const handleRoutineTypeChange = async (option: SingleValue<RoutineTypeOption>) => {
    if (!option) {
      return
    }

    try {
      await dispatch(
        updateRoutineAction({
          payload: {
            routineTypeId: option.value
          }
        })
      ).unwrap()

      setSelectedRoutineTypeOption(option)
    } catch (error) {
      console.error("Failed to update routine type", error)
    }
  }

  const handleSave = () => {
    handleSubmit(onSubmit)()
    handleDismissEdit()
  }

  const handleDismissEdit = () => {
    if (editDate) {
      setEditDate(false)
      return
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const onSubmit = async (data: Record<string, string | number>) => {
    try {
      const action = await dispatch(updateRoutineAction({ payload: data }))

      if (action.type === "updateRoutineAction/fulfilled") {
        handleDismissEdit()
        return
      }

      if (action.type === "updateRoutineAction/rejected") {
        setError("date", {
          type: "manual",
          message: "Failed to update routine"
        })
      }
    } catch (error) {
      console.error("Failed to update routine", error)
      setError("date", {
        type: "manual",
        message: "Failed to update routine"
      })
    }
  }

  useEffect(() => {
    if (!userId || !id) {
      return
    }

    if (`${routine?.id}` === `${id}`) {
      return
    }

    dispatch(getRoutineByIdAction({ routineId: id }))
  }, [dispatch, id, routine?.id, userId])

  useEffect(() => {
    if (!userId) {
      return
    }

    dispatch(getAllRoutineTypesAction())
  }, [dispatch, userId])

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
          <Form onSubmit={handleSubmit(onSubmit)}>
            {editDate ? (
              <InlineField
                $variant="date"
                $isEditing
                style={{ flex: "unset", justifyContent: "center" }}
              >
                <FieldInput style={{ flex: "unset" }}>
                  <DateInput id="date" defaultValue={routine?.date} />
                </FieldInput>
                <FieldActions>
                  <IconButton onClick={handleSave}>
                    <MdCheck />
                  </IconButton>
                  <IconButton onClick={handleDismissEdit}>
                    <MdClose />
                  </IconButton>
                </FieldActions>
              </InlineField>
            ) : (
              <InlineField $variant="date" style={{ justifyContent: "center" }}>
                <DisplayValue style={{ flex: "unset", justifyContent: "center" }}>
                  {date.day}
                  <sup>{date.getOrdinalSuffix}</sup> {date.month} {date.year}
                </DisplayValue>
                <FieldActions>
                  <IconButton onClick={handleEditDate}>
                    <MdModeEdit />
                  </IconButton>
                </FieldActions>
              </InlineField>
            )}
            <TypeRow>
              <BackButton type="button" onClick={handleBack} aria-label="Go back">
                <MdChevronLeft />
              </BackButton>
              <TypeSelectWrap>
                <Select
                  inputId="routine-type"
                  options={routineTypeOptions}
                  value={selectedRoutineType}
                  onChange={handleRoutineTypeChange}
                  placeholder="Select routine type"
                  isSearchable
                  menuPortalTarget={selectMenuPortalTarget}
                  menuPosition="fixed"
                  styles={baseSelectStyles as never}
                />
              </TypeSelectWrap>
            </TypeRow>
          </Form>
        </FormProvider>
      }
    >
      <RoutineUpdater />
    </Page>
  )
}

export default RoutineById

const Form = styled.form`
  padding: 1rem;
`

const InlineField = styled.div<{
  $variant: "date" | "title" | "title-secondary"
  $isEditing?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
  width: min(520px, 94%);
  min-height: ${({ $variant }) => ($variant === "date" ? "2.2rem" : "2.6rem")};
  border-bottom: ${({ $isEditing }) => ($isEditing ? "1px solid #d8d8d8" : "none")};
  padding-inline: 0.3rem;
  gap: 0.25rem;
`

const TypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: min(520px, 94%);
  margin: 0 auto;
  min-height: 3.3rem;
  padding-inline: 0.3rem;
`

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 0;
  background: transparent;
  color: #274057;
  cursor: pointer;
  padding: 0;

  svg {
    font-size: 1.4rem;
  }
`

const FieldInput = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  min-width: 0;
`

const FieldActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`

const DisplayValue = styled.div`
  flex: 1;
  text-align: left;
  font-size: 0.8rem;
  color: #22222299;
`

const TypeSelectWrap = styled.div`
  width: 100%;

  > div {
    width: 100%;
  }
`
