import { FC, ReactNode, useEffect, useRef } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { RootState } from "@store/store"
import { refreshAccessToken } from "@store/slices/auth/auth.slice"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state: RootState) => state.auth.accessToken)
  const isLoading = useAppSelector((state: RootState) => state.auth.isLoading)
  const refreshing = useAppSelector((state: RootState) => state.auth.refreshing)
  const isAuthChecked = useAppSelector((state: RootState) => state.auth.isAuthChecked)
  const location = useLocation()

  console.log("accessToken", accessToken)
  console.log("isLoading", isLoading)
  console.log("refreshing", refreshing)
  console.log("isAuthChecked", isAuthChecked)

  const hasRefreshed = useRef(false) // Flag to track if refresh has happened

  useEffect(() => {
    if (!accessToken && !refreshing && !isAuthChecked && !hasRefreshed.current) {
      hasRefreshed.current = true // Set the flag to true after the first run
      dispatch(refreshAccessToken())
    }
  }, [dispatch, accessToken, refreshing, isAuthChecked])

  if ((isLoading || refreshing) && !isAuthChecked) {
    // Show a loading spinner while checking auth state or refreshing the token
    return <div>Loading...</div>
  }

  return accessToken ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  )
}
