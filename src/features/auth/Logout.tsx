import { API } from "@root/services/axios"
import { useAppDispatch } from "@root/store/hooks/store"
import { logout } from "@root/store/slices/auth/auth.slice"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Logout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call the backend logout endpoint to clear the refresh token cookie
        await API.post("/auth/logout", {}, { withCredentials: true })

        // Dispatch logout action to clear accessToken from Redux store
        dispatch(logout())

        // Redirect user to login page after successful logout
        navigate("/auth/login")
      } catch (error) {
        console.error("Logout failed: ", error)
      }
    }

    handleLogout()
  }, [dispatch, navigate])

  return <div>Logging out...</div>
}
