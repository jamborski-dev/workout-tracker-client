import { FullPageLoader } from "@root/components/__shared/FullPageLoader"
import { logoutUser } from "@root/services/auth.service"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { logout } from "@root/store/slices/auth/auth.slice"
import type { RootState } from "@root/store/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const Logout = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state: RootState) => state.auth.user)

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout failed: ", error)
    } finally {
      dispatch(logout())
      navigate("/auth/login")
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect when the user changes, not on every render
  useEffect(() => {
    if (user) {
      handleLogout()
    } else {
      navigate("/auth/login")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return <FullPageLoader text={t("auth.loggingOut")} />
}
