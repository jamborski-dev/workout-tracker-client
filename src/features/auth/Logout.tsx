import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { API } from "@root/services/axios"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { logout } from "@root/store/slices/auth/auth.slice"
import { RootState } from "@root/store/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Logout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state: RootState) => state.auth.user)

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true })
    } catch (error) {
      console.error("Logout failed: ", error)
    } finally {
      dispatch(logout())
      navigate("/auth/login")
    }
  }

  useEffect(() => {
    if (user) {
      handleLogout()
    } else {
      navigate("/auth/login")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return <FullPageLoader text="Logging out..." />
}
