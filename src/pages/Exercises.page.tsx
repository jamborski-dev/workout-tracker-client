import { PageHeader } from "@root/components/__shared/PageHeader"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { Page } from "@root/components/__shared/layout/Page"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IoCreateOutline } from "react-icons/io5"
import { getAllExercisesAction } from "@root/store/slices/exercises/exercises.thunks"
import {
  selectExerciseList,
  selectExercisesLoading
} from "@root/store/slices/exercises/exercises.selectors"
import { ExerciseList } from "@root/components/_lists/ExerciseList"
import { useTranslation } from "react-i18next"

const ExercisesPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handlePageAction = async () => {
    navigate(`/exercises/create`)
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
          title={t("exercises.title")}
          action={{
            callback: handlePageAction,
            label: t("exercises.new"),
            icon: <IoCreateOutline />
          }}
        />
      }
    >
      <ExerciseList items={exerciseList} isLoading={isLoading} />
    </Page>
  )
}

export default ExercisesPage
