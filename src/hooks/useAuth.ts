import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectUserId } from "@root/store/slices/user/user.selectors"
import { getUsersAction } from "@root/store/slices/user/user.slice"
import { useEffect } from "react"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(selectUserId)

  const getUsers = async () => {
    await dispatch(getUsersAction())
  }

  useEffect(() => {
    getUsers()
  }, [])

  return {
    userId
  }
}
