import { MainTemplate } from "@root/templates/MainTemplate"
import { hideToast } from "@store/slices/toast/toast.slice"
import { getUsersAction } from "@store/slices/users/users.slice"
import { RootState } from "@store/store"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { Toast } from "@components/Toast/Toast"
import { useAppDispatch, useAppSelector } from "../store/hooks/store"
import HomePage from "./Home.page"
import RoutinesPage from "./Routines.page"
import RoutineByIdPage from "./Routine.id.page"

function App() {
  const dispatch = useAppDispatch()

  const { message, type, show } = useAppSelector((state: RootState) => state.toast)

  useEffect(() => {
    dispatch(getUsersAction())
  }, [dispatch])

  return (
    <>
      <MainTemplate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/:id" element={<RoutineByIdPage />} />
        </Routes>
      </MainTemplate>
      {show && <Toast message={message} type={type} onDismiss={() => dispatch(hideToast())} />}
      {/* TODO add dialog modal for confirmation messages */}
    </>
  )
}

export default App
