import { Fieldset, Form, InputGroup } from "@root/components/__shared/Form/Form"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { selectFormMode, selectFormUpdateValues } from "@store/slices/routines/routines.selectors"
import { cancelEdit } from "@store/slices/routines/routines.slice"
import { createRoutineAction, updateRoutineAction } from "@store/slices/routines/routines.thunks"
import { selectUserId } from "@store/slices/users/users.selectors"
import { CreateRoutinePayload } from "@root/types/data"
import { useEffect } from "react"
import { SubmitHandler, useForm, FormProvider } from "react-hook-form"
import { ButtonGroup, PrimaryButton, SecondaryButton } from "../__shared/Button"
import { Divider } from "../__shared/Divider"
import { setRightPanel } from "@store/slices/page/page.slice"
import MovementsFieldArray from "./MovementsFieldArray" // Import the movements component

export const RoutineForm = () => {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(selectUserId)
  const mode = useAppSelector(selectFormMode)
  const updateValues = useAppSelector(selectFormUpdateValues)

  // Initialize form with react-hook-form
  const methods = useForm<CreateRoutinePayload>({
    defaultValues: {
      date: new Date().toISOString(),
      movements: []
    }
  })

  const { register, handleSubmit, setValue } = methods

  const onSubmit: SubmitHandler<CreateRoutinePayload> = async data => {
    if (!userId) return

    if (mode === "edit") {
      dispatch(updateRoutineAction({ ...data, id: updateValues!.id }))
    }

    if (mode === "add") {
      dispatch(createRoutineAction({ ...data }))
    }
  }

  const handleCancelEdit = () => {
    dispatch(setRightPanel(undefined))
    dispatch(cancelEdit())
  }

  useEffect(() => {
    if (mode === "add") {
      setValue("notes", "")
      setValue("date", new Date().toISOString())
    }

    if (mode === "edit" && updateValues) {
      setValue("notes", updateValues.notes)
      setValue("date", new Date(updateValues.date).toISOString())
    }
  }, [mode, setValue, updateValues])

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset>
          {/* <InputRow>
            <InputGroup>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                {...register("date", {
                  setValueAs: (value: string) => new Date(value).toISOString()
                })}
              />
            </InputGroup>
          </InputRow> */}

          <Divider />

          {/* Movements Section */}
          <MovementsFieldArray />

          <InputGroup>
            <label htmlFor="description">Notes</label>
            <textarea
              id="notes"
              placeholder="e.g. 5x5 Training A..."
              {...register("notes", {
                setValueAs: value => value.trim()
              })}
            />
          </InputGroup>
        </Fieldset>

        <Divider />
        <ButtonGroup>
          <PrimaryButton type="submit">Submit</PrimaryButton>
          {mode === "edit" && (
            <SecondaryButton type="button" onClick={handleCancelEdit}>
              Cancel
            </SecondaryButton>
          )}
        </ButtonGroup>
      </Form>
    </FormProvider>
  )
}
