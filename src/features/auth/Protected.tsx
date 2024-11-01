import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { useAppSelector } from "@root/store/hooks/store"
import { RootState } from "@store/store"
import { FC, ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = useAppSelector((state: RootState) => state.auth.accessToken)
  const isLoading = useAppSelector((state: RootState) => state.auth.isLoading)
  const refreshing = useAppSelector((state: RootState) => state.auth.refreshing)
  const isAuthChecked = useAppSelector((state: RootState) => state.auth.isAuthChecked)
  const location = useLocation()

  if ((isLoading || refreshing) && !isAuthChecked) {
    // Show a loading spinner while checking auth state or refreshing the token
    return <FullPageLoader />
  }

  return accessToken ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  )
}
