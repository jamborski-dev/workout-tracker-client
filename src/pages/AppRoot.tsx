import { Toast } from "@components/Toast/Toast"
import { Login } from "@root/features/auth/Login"
import { ForgotPassword } from "@root/features/auth/ForgotPassword"
import { ResetPassword } from "@root/features/auth/ResetPassword"
import AdminPage from "./Admin"
import SettingsPage from "./Settings.page"
import { MainTemplate } from "@root/templates/MainTemplate"
import {
  LAST_APP_LOCATION_STORAGE_KEY,
  getFromLocalStorage,
  saveToLocalStorage
} from "@root/utils/local-storage"
import { hideToast } from "@store/slices/toast/toast.slice"
import type { RootState } from "@store/store"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/hooks/store"
import ExerciseCreatePage from "./Exercise.create.page"
import ExercisesPage from "./Exercises.page"
import RoutineByIdPage from "./Routine.id.page"
import RoutinesPage from "./Routines.page"
import RoutineNewPage from "./RoutineNew.page"
// import { Register } from "@root/features/auth/Register"
import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { Logout } from "@root/features/auth/Logout"
import { ProtectedRoute } from "@root/features/auth/Protected"
import { loadSessionAction } from "@root/store/slices/auth/auth.thunks"
import { useEffect, useRef } from "react"
import { HttpErrorPage } from "./HttpError.page"

const AUTH_ROUTES = ["/auth"]

function App() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const hasTriedRestoringLocation = useRef(false)

  const { message, type, show } = useAppSelector((state: RootState) => state.toast)

  const user = useAppSelector((state: RootState) => state.auth.user)
  const isAuthChecked = useAppSelector((state: RootState) => state.auth.isAuthChecked)

  useEffect(() => {
    if (!user && !isAuthChecked) {
      dispatch(loadSessionAction())
    }
  }, [dispatch, isAuthChecked, user])

  useEffect(() => {
    if (!user || !isAuthChecked) {
      return
    }

    if (AUTH_ROUTES.some(path => location.pathname.startsWith(path))) {
      return
    }

    saveToLocalStorage(
      LAST_APP_LOCATION_STORAGE_KEY,
      `${location.pathname}${location.search}${location.hash}`
    )
  }, [isAuthChecked, location.hash, location.pathname, location.search, user])

  useEffect(() => {
    if (!user || !isAuthChecked || hasTriedRestoringLocation.current) {
      return
    }

    hasTriedRestoringLocation.current = true

    const lastLocation = getFromLocalStorage<string>(LAST_APP_LOCATION_STORAGE_KEY)
    if (!lastLocation) {
      return
    }

    if (location.pathname === "/" && lastLocation !== "/") {
      navigate(lastLocation, { replace: true })
    }
  }, [isAuthChecked, location.pathname, navigate, user])

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
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
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
                <Navigate to="/routines" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute accessRole="ADMIN">
                <AdminPage />
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
            path="/routines/new"
            element={
              <ProtectedRoute>
                <RoutineNewPage />
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
            path="/exercises/create"
            element={
              <ProtectedRoute>
                <ExerciseCreatePage />
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
