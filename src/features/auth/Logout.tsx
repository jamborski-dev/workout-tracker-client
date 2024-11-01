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
      } catch (error) {
        console.error("Logout failed: ", error)
      } finally {
        // Dispatch the logout action to clear the accessToken in the store
        dispatch(logout())
        navigate("/auth/login")
      }
    }

    handleLogout()
  }, [dispatch, navigate])

  return <div>Logging out...</div>
}
