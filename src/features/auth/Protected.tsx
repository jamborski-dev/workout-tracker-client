import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { useAppSelector } from "@root/store/hooks/store"
import { RootState } from "@store/store"
import { FC, ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isLoading = useAppSelector((state: RootState) => state.auth.isLoading)
  const isRefreshing = useAppSelector((state: RootState) => state.auth.isRefreshing)
  const isAuthChecked = useAppSelector((state: RootState) => state.auth.isAuthChecked)
  const user = useAppSelector((state: RootState) => state.auth.user)
  const location = useLocation()

  if (isLoading || isRefreshing) {
    // Show a loading spinner while checking auth state or refreshing the token
    return <FullPageLoader />
  }

  if (user && isAuthChecked && ["/auth/login", "/auth", "/auth/"].includes(location.pathname)) {
    // If user is logged in and auth state is checked, redirect to home page
    return <Navigate to="/" replace />
  }

  return user ? <>{children}</> : <Navigate to="/auth/login" state={{ from: location }} replace />
}
