import { PageContent } from "@components/__shared/PageContent"
import { PageHeader } from "@components/__shared/PageHeader"
import { Button, ButtonGroup } from "@root/components/__shared/Button"
import { RoutineUpdater } from "@root/components/__shared/Form/RoutineUpdater"
import { RoutinesList } from "@root/components/_lists/RoutinesList"
import { useAuth } from "@root/hooks/useAuth"
import { useAppDispatch } from "@root/store/hooks/store"
import { initRoutineAction } from "@root/store/slices/routines/routines.thunks"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const Home = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { userId } = useAuth()

  const handleInitRoutine = async () => {
    if (!userId) {
      console.info("User not logged in")
      return
    }

    const resultAction = await dispatch(initRoutineAction({ userId }))

    if (initRoutineAction.fulfilled.match(resultAction)) {
      const newRoutineId = resultAction.payload.id // Extract the new routine ID from the action payload
      navigate(`/routines/${newRoutineId}`) // Redirect to the routine page
    } else {
      console.error("Failed to start routine")
    }
  }

  return (
    <>
      {/* <PageHeader title="Home" brew="Track and plan your training in one place" />
      <PageContent>
        <Page>
          <RoutinesList />
          <ButtonGroup>
            <Button onClick={handleInitRoutine}>Start Workout</Button>
          </ButtonGroup>
        </Page>
      </PageContent> */}
      <RoutineUpdater />
    </>
  )
}

export default Home

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 100%;
`
