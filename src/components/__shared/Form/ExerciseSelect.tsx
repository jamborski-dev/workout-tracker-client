import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectExerciseList } from "@root/store/slices/exercises/exercises.selectors"
import { getAllExercisesAction } from "@root/store/slices/exercises/exercises.thunks"
import { Exercise } from "@root/types/data"
import { ChangeEvent, useEffect } from "react"

interface ExerciseSelectProps {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  defaultValue?: string
}

export const ExerciseSelect = ({ onChange, defaultValue }: ExerciseSelectProps) => {
  const dispatch = useAppDispatch()
  const exerciseList = useAppSelector(selectExerciseList)

  const getExercises = async () => {
    await dispatch(getAllExercisesAction())
  }

  useEffect(() => {
    getExercises()
  }, [])

  return (
    <select onChange={onChange} defaultValue={defaultValue}>
      <option value="" disabled>
        Select an exercise
      </option>
      {exerciseList.map((exercise: Exercise) => (
        <option key={exercise.id} value={exercise.id}>
          {exercise.name}
        </option>
      ))}
    </select>
  )
}
