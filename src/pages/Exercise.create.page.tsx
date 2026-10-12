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
import { useTranslation } from "react-i18next"
import { enumLabel } from "@root/i18n"

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

type ExerciseFormValues = Omit<Exercise, "id"> & { requestPublic?: boolean; base?: boolean }

const CreateExercisePage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const exercises = useAppSelector(state => state.exercises.list)
  const isAdmin = useAppSelector(state => state.auth.user?.role === "ADMIN")
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

  const methods = useForm<ExerciseFormValues>({
    mode: "onChange"
  })
  const { handleSubmit, formState, register } = methods
  const { errors } = formState

  const onSubmit = async (data: FieldValues) => {
    try {
      await dispatch(
        createExerciseAction({
          ...normalizeExercisePayload(data as Omit<Exercise, "id">),
          requestPublic: Boolean(data.requestPublic),
          base: isAdmin && Boolean(data.base)
        })
      ).unwrap()
      dispatch(getAllExercisesAction())
      methods.reset({
        name: "",
        description: "",
        muscleGroup: "",
        category: "",
        complexity: "",
        equipment: "",
        favourite: false,
        requestPublic: false,
        base: false
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
    <Page headerComponent={<PageHeader title={t("exercises.createTitle")} />}>
      <Container>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="name">{t("exercises.name")}</Label>
              <TextInput
                {...register("name", {
                  onChange: filterList,
                  validate: value => {
                    if (allNames.has(value.toLocaleLowerCase())) {
                      return t("exercises.nameUnique")
                    }

                    return true
                  }
                })}
              />
              {errors.name && <InputError>{errors.name.message}</InputError>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">{t("exercises.description")}</Label>
              <TextInput {...register("description", { minLength: 10, maxLength: 150 })} />
              {errors.description && <InputError>{errors.description.message}</InputError>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="muscleGroup">{t("exercises.muscleGroups")}</Label>
              <TextInput {...register("muscleGroup")} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="category">{t("exercises.category")}</Label>
              <SelectInput {...register("category")} defaultValue="">
                <option value="">{t("exercises.none")}</option>
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {enumLabel("category", option)}
                  </option>
                ))}
              </SelectInput>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="complexity">{t("exercises.complexity")}</Label>
              <SelectInput {...register("complexity")} defaultValue="">
                <option value="">{t("exercises.none")}</option>
                {COMPLEXITY_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {enumLabel("complexity", option)}
                  </option>
                ))}
              </SelectInput>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="equipment">{t("exercises.equipment")}</Label>
              <SelectInput {...register("equipment")} defaultValue="">
                <option value="">{t("exercises.none")}</option>
                {EQUIPMENT_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {enumLabel("equipment", option)}
                  </option>
                ))}
              </SelectInput>
            </FormGroup>
            <CheckboxRow>
              <CheckboxInput type="checkbox" {...register("favourite")} />
              <CheckboxLabel>{t("exercises.pin")}</CheckboxLabel>
            </CheckboxRow>
            <CheckboxRow>
              <CheckboxInput type="checkbox" {...register("requestPublic")} />
              <CheckboxLabel>
                {t("exercises.share")}
              </CheckboxLabel>
            </CheckboxRow>
            {isAdmin && (
              <CheckboxRow>
                <CheckboxInput type="checkbox" {...register("base")} />
                <CheckboxLabel>{t("exercises.addBase")}</CheckboxLabel>
              </CheckboxRow>
            )}
            <Button type="submit" label={t("exercises.save")} loadingText={t("exercises.saving")} isLoading={isUpdating} />
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
  border-bottom: 1px solid var(--border-default);
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`

const SelectInput = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid var(--border-default);
  background: var(--surface);

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`

const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--text-2);
`

const CheckboxInput = styled.input`
  margin: 0;
`

const CheckboxLabel = styled.span`
  font-size: 0.9rem;
`
