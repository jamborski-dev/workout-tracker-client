import { MainTemplate } from "@root/templates/MainTemplate"
import { hideToast } from "@store/slices/toast/toast.slice"
import { RootState } from "@store/store"
import { Navigate, Route, Routes } from "react-router-dom"
import { Toast } from "@components/Toast/Toast"
import { useAppDispatch, useAppSelector } from "../store/hooks/store"
import HomePage from "./Home.page"
import RoutinesPage from "./Routines.page"
import RoutineByIdPage from "./Routine.id.page"
import { Login } from "@root/features/auth/Login"
// import { Register } from "@root/features/auth/Register"
import { ProtectedRoute } from "@root/features/auth/Protected"
import { useEffect } from "react"
import { refreshTokenAction } from "@root/store/slices/auth/auth.thunks"
import { Logout } from "@root/features/auth/Logout"
import { HttpErrorPage } from "./HttpError.page"
import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import ExercisesPage from "./Exercises.page"

function App() {
  const dispatch = useAppDispatch()

  const { message, type, show } = useAppSelector((state: RootState) => state.toast)

  const user = useAppSelector((state: RootState) => state.auth.user)
  const isAuthChecked = useAppSelector((state: RootState) => state.auth.isAuthChecked)

  useEffect(() => {
    if (!user && !isAuthChecked) {
      dispatch(refreshTokenAction())
    }
  }, [dispatch, isAuthChecked, user])

  if (!isAuthChecked) {
    // Render a loading spinner while authentication is being checked
    return <FullPageLoader text={"Retrieving session..."} />
  }

  return (
    <>
      <MainTemplate>
        <Routes>
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<Login />} />
          {/* <Route path="/auth/register" element={<Register />} /> */}
          <Route path="/auth/logout" element={<Logout />} />
          <Route path="/auth/*" element={<Navigate to="/auth/login" replace />} />
          <Route
            path="*"
            element={
              <HttpErrorPage
                code={404}
                status="Not Found"
                text="Sorry, the page you are looking for does not exist."
                action={{
                  label: "Go Back",
                  to: "/"
                }}
              />
            }
          />
          <Route
            path="/401"
            element={
              <HttpErrorPage
                code={401}
                status="Not Authorized"
                text="Sorry, you do not have access to this content."
                action={{
                  label: "Login",
                  to: "/auth/login"
                }}
              />
            }
          />

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
          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <ExercisesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises/:id"
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
