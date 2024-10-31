// import { useEffect } from "react"
// import { getUsersAction } from "@store/slices/users/users.slice"
import { MainTemplate } from "@root/templates/MainTemplate"
import { hideToast } from "@store/slices/toast/toast.slice"
import { RootState } from "@store/store"
import { Route, Routes } from "react-router-dom"
import { Toast } from "@components/Toast/Toast"
import { useAppDispatch, useAppSelector } from "../store/hooks/store"
import HomePage from "./Home.page"
import RoutinesPage from "./Routines.page"
import RoutineByIdPage from "./Routine.id.page"
import { Login } from "@root/features/auth/Login"
import { Register } from "@root/features/auth/Register"
import { ProtectedRoute } from "@root/features/auth/Protected"
import { useEffect } from "react"
import { refreshAccessToken } from "@root/store/slices/auth/auth.slice"
import { Logout } from "@root/features/auth/Logout"
import { NotFound } from "./NotFound.page"

function App() {
  const dispatch = useAppDispatch()

  const { message, type, show } = useAppSelector((state: RootState) => state.toast)

  const accessToken = useAppSelector((state: RootState) => state.auth.accessToken)
  const isAuthChecked = useAppSelector((state: RootState) => state.auth.isAuthChecked)

  useEffect(() => {
    if (!accessToken && !isAuthChecked) {
      dispatch(refreshAccessToken())
    }
  }, [dispatch, accessToken, isAuthChecked])

  if (!isAuthChecked) {
    // Render a loading spinner while authentication is being checked
    return <div>Loading...</div>
  }

  return (
    <>
      <MainTemplate>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/401" element={<div>401: Not Authorised</div>} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routines"
            element={
              <ProtectedRoute>
                <RoutinesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routines/:id"
            element={
              <ProtectedRoute>
                <RoutineByIdPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainTemplate>
      {show && <Toast message={message} type={type} onDismiss={() => dispatch(hideToast())} />}
      {/* TODO add dialog modal for confirmation messages */}
    </>
  )
}

export default App
