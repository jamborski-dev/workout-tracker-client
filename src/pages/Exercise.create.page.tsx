import { Button } from "@root/components/__shared/Button"
import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { Page } from "@root/components/__shared/layout/Page"
import { PageHeader } from "@root/components/__shared/PageHeader"
import { ExerciseList } from "@root/components/_lists/ExerciseList"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import {
  createExerciseAction,
  getAllExercisesAction
} from "@root/store/slices/exercises/exercises.thunks"
import { Exercise } from "@root/types/data"
import { useEffect, useState, ChangeEvent } from "react"
import { FieldValues, FormProvider, useForm } from "react-hook-form"
import styled from "styled-components"

const CreateExercisePage = () => {
  const dispatch = useAppDispatch()
  const exercises = useAppSelector(state => state.exercises.list)
  const isLoading = useAppSelector(state => state.exercises.isLoading)
  const isUpdating = useAppSelector(state => state.exercises.isUpdating)
  const [filtered, setFiltered] = useState<Exercise[]>([])

  const allNames = new Set(
    exercises?.map(exercise => (exercise?.name || "").toLocaleLowerCase()) || []
  )

  const filterList = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLocaleLowerCase()
    const items = exercises.filter(exercise => new RegExp(value, "gi").test(exercise.name))

    if (value.length === 0) {
      setFiltered([])
    } else {
      setFiltered(items)
    }
  }

  const methods = useForm<Omit<Exercise, "id">>({
    mode: "onChange"
  })
  const { handleSubmit, formState, register } = methods
  const { errors } = formState

  const onSubmit = async (data: FieldValues) => {
    try {
      await dispatch(createExerciseAction({ ...(data as Omit<Exercise, "id">) })).unwrap()
      dispatch(getAllExercisesAction())
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    dispatch(getAllExercisesAction())
  }, [])

  if (isLoading && exercises.length === 0) {
    return <FullPageLoader />
  }

  return (
    <Page headerComponent={<PageHeader title={"Create new exercise"} />}>
      <Container>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <TextInput
                {...register("name", {
                  onChange: filterList,
                  validate: value => {
                    console.log(value)
                    if (allNames.has(value.toLocaleLowerCase())) {
                      return "Name must be unique"
                    }

                    return true
                  }
                })}
              />
              {errors.name && <InputError>{errors.name.message}</InputError>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextInput {...register("description", { minLength: 10, maxLength: 150 })} />
              {errors.description && <InputError>{errors.description.message}</InputError>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="muscleGroup">Muscle Groups</Label>
              <TextInput {...register("muscleGroup")} />
            </FormGroup>
            <Button type="submit" label="Save" loadingText="Saving..." isLoading={isUpdating} />
          </Form>
        </FormProvider>
        <ExerciseList items={filtered.length ? filtered : exercises} />
      </Container>
    </Page>
  )
}

export default CreateExercisePage

const Container = styled.div`
  padding: 1rem;
  display: flex;
  /* justify-content: center; */
  flex-direction: column;
  align-items: center;
`

const Form = styled.form`
  padding: 1rem;
  max-width: 400px;
  display: flex;
  flex-direction: column;
`

const FormGroup = styled.div`
  margin-bottom: 1rem;
`

const InputError = styled.p`
  color: red;
  font-size: 0.8rem;
`

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
`

const TextInput = styled.input.attrs({ type: "text" })`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid #d1d1d1;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #399fff;
  }
`
