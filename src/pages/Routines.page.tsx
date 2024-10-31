import { PageHeader } from "@root/components/__shared/PageHeader"
import { RoutinesList } from "@root/components/_lists/RoutinesList"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { Page } from "@root/components/__shared/layout/Page"
import { selectList, selectRoutinesLoading } from "@root/store/slices/routines/routines.selectors"
import {
  getAllRoutinesAction,
  initRoutineAction
} from "@root/store/slices/routines/routines.thunks"
import { selectUserId } from "@root/store/slices/user/user.selectors"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IoCreateOutline } from "react-icons/io5"

const RoutinesPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handlePageAction = async () => {
    try {
      const { id } = await dispatch(initRoutineAction()).unwrap()
      navigate(`/routines/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const userId = useAppSelector(selectUserId) || 1
  const isLoading = useAppSelector(selectRoutinesLoading)
  const routines = useAppSelector(selectList) || []

  useEffect(() => {
    if (!userId) return

    dispatch(getAllRoutinesAction())
  }, [dispatch, userId])

  return (
    <Page
      headerComponent={
        <PageHeader
          title="Routines"
          action={{ callback: handlePageAction, label: "New Routine", icon: <IoCreateOutline /> }}
        />
      }
    >
      <RoutinesList routines={routines} isLoading={isLoading} />
    </Page>
  )
}

export default RoutinesPage
