import { PageContent } from "@root/components/__shared/PageContent"
import { PageHeader } from "@root/components/__shared/PageHeader"
import { RoutinesList } from "@root/components/_lists/RoutinesList"
import { setRightPanel } from "@store/slices/page/page.slice"
import { useAppDispatch } from "@store/hooks/store"

const RoutinesPage = () => {
  const dispatch = useAppDispatch()

  const handlePageAction = () => {
    dispatch(
      setRightPanel({
        view: "routineForm",
        title: "New Routine"
      })
    )
  }

  return (
    <>
      <PageHeader title="Routines" action={{ callback: handlePageAction, label: "New Routine" }} />
      <PageContent>
        <RoutinesList />
      </PageContent>
    </>
  )
}

export default RoutinesPage
