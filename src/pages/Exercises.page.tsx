import { PageHeader } from "@root/components/__shared/PageHeader"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { Page } from "@root/components/__shared/layout/Page"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IoCreateOutline } from "react-icons/io5"
import {
  createExerciseAction,
  getAllExercisesAction
} from "@root/store/slices/exercises/exercises.thunks"
import {
  selectExerciseList,
  selectExercisesLoading
} from "@root/store/slices/exercises/exercises.selectors"
import { ExerciseList } from "@root/components/_lists/ExerciseList"

const ExercisesPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handlePageAction = async () => {
    try {
      const { id } = await dispatch(createExerciseAction()).unwrap()
      navigate(`/exercise/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const isLoading = useAppSelector(selectExercisesLoading)
  const exerciseList = useAppSelector(selectExerciseList) || []

  useEffect(() => {
    dispatch(getAllExercisesAction())
  }, [dispatch])

  return (
    <Page
      headerComponent={
        <PageHeader
          title="Exercises"
          action={{
            callback: handlePageAction,
            label: "New Exercise",
            icon: <IoCreateOutline />,
            disabled: true
          }}
        />
      }
    >
      <ExerciseList items={exerciseList} isLoading={isLoading} />
    </Page>
  )
}

export default ExercisesPage
