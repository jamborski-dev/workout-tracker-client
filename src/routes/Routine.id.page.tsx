import { RoutineUpdater } from "@root/components/__shared/Form/RoutineUpdater"
// import { RoutineForm } from "@root/components/_forms/Routine.form"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import {
  selectCurrentRoutine
  // selectCurrentRoutineUpdating,
  // selectRoutinesLoading
} from "@root/store/slices/routines/routines.selectors"
import { getOneRoutineAction } from "@root/store/slices/routines/routines.thunks"
import { selectUserId } from "@root/store/slices/users/users.selectors"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"

const RoutineById = () => {
  const { id } = useParams()
  const userId = useAppSelector(selectUserId)
  const dispatch = useAppDispatch()
  // const isUpdating = useAppSelector(selectCurrentRoutineUpdating)
  // const isLoading = useAppSelector(selectRoutinesLoading)
  const routine = useAppSelector(selectCurrentRoutine)

  const getRoutine = async () => {
    if (!userId || !id) {
      console.info("No user or routine id")
      return
    }

    await dispatch(getOneRoutineAction({ userId, routineId: id }))
  }

  useEffect(() => {
    getRoutine()
  }, [userId, id])

  // if (isLoading) {
  //   return <p>Loading...</p>
  // }

  // if (!routine) {
  //   return <p>No routine found</p>
  // }

  return (
    <Page>
      <header>
        <h4>{routine?.name || "New Routine"}</h4>
        <div>
          24<sup>th</sup> Oct 2024
        </div>
      </header>
      {/* <p>{routine.date}</p> */}
      {/* <RoutineForm /> */}
      <RoutineUpdater />
    </Page>
  )
}

export default RoutineById

const Page = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  > header {
    padding: 1rem;
    margin-bottom: 2rem;

    h4 {
      font-size: 1.2rem;
      margin: 0;
      font-weight: 400;
      text-align: center;
    }

    div {
      font-size: 0.8rem;
      text-align: center;
      color: #22222299;

      sup {
        font-size: 0.5rem;
      }
    }
  }
`
