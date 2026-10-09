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
import type { Exercise } from "@root/types/data"
import { useEffect, useState } from "react"
import type { ChangeEvent } from "react"
import { FormProvider, useForm } from "react-hook-form"
import type { FieldValues } from "react-hook-form"
import styled from "styled-components"

const CATEGORY_OPTIONS = ["push", "pull", "legs", "core"]
const COMPLEXITY_OPTIONS = ["compound", "isolation"]
const EQUIPMENT_OPTIONS = ["barbell", "dumbbell", "cable", "machine", "bodyweight"]

const normalizeExercisePayload = (payload: Omit<Exercise, "id">): Omit<Exercise, "id"> => ({
  ...payload,
  name: payload.name?.trim(),
  description: payload.description?.trim(),
  muscleGroup: payload.muscleGroup?.trim(),
  category: payload.category || null,
  complexity: payload.complexity || null,
  equipment: payload.equipment || null,
  favourite: payload.favourite ?? false
})

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
      await dispatch(
        createExerciseAction(normalizeExercisePayload(data as Omit<Exercise, "id">))
      ).unwrap()
      dispatch(getAllExercisesAction())
      methods.reset({
        name: "",
        description: "",
        muscleGroup: "",
        category: "",
        complexity: "",
        equipment: "",
        favourite: false
      })
      setFiltered([])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    dispatch(getAllExercisesAction())
  }, [dispatch])

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
            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <SelectInput {...register("category")} defaultValue="">
                <option value="">None</option>
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="complexity">Complexity</Label>
              <SelectInput {...register("complexity")} defaultValue="">
                <option value="">None</option>
                {COMPLEXITY_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="equipment">Equipment</Label>
              <SelectInput {...register("equipment")} defaultValue="">
                <option value="">None</option>
                {EQUIPMENT_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </FormGroup>
            <CheckboxRow>
              <CheckboxInput type="checkbox" {...register("favourite")} />
              <CheckboxLabel>Pin as favourite</CheckboxLabel>
            </CheckboxRow>
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

const SelectInput = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid #d1d1d1;
  background: white;

  &:focus {
    outline: none;
    border-color: #399fff;
  }
`

const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #4f4f4f;
`

const CheckboxInput = styled.input`
  margin: 0;
`

const CheckboxLabel = styled.span`
  font-size: 0.9rem;
`
