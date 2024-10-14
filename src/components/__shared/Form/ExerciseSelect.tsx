import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectExerciseList } from "@root/store/slices/exercises/exercises.selectors"
import { getAllExercisesAction } from "@root/store/slices/exercises/exercises.thunks"
import { selectUserId } from "@root/store/slices/users/users.selectors"
import { Exercise } from "@root/types/data"
import { useEffect } from "react"

interface ExerciseSelectProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue?: string
}

export const ExerciseSelect = ({ onChange, defaultValue }: ExerciseSelectProps) => {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(selectUserId)
  const exerciseList = useAppSelector(selectExerciseList)

  const getExercises = async () => {
    if (!userId) return
    await dispatch(getAllExercisesAction({ userId }))
  }

  useEffect(() => {
    getExercises()
  }, [])

  if (!userId) {
    return null
  }

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
