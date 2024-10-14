import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { User } from "@store/slices/users/users.slice"
import { selectUsers, selectUsersLoading } from "@store/slices/users/users.selectors"
import { setUser } from "@store/slices/users/users.slice"
import { useForm, SubmitHandler } from "react-hook-form"

interface UserSelectValues {
  user: string
}

export const UserSelectForm = () => {
  const dispatch = useAppDispatch()

  const users = useAppSelector(selectUsers)
  const usersLoading = useAppSelector(selectUsersLoading)
  const { register, handleSubmit } = useForm<UserSelectValues>()

  const onSubmit: SubmitHandler<UserSelectValues> = data => {
    dispatch(setUser(data.user))
  }

  if (usersLoading) return <p>Loading users...</p>
  if (!users || !users.length) return <p>No users available</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(onSubmit)}>
      <select id={"user"} {...register("user")}>
        {users?.map((user: User) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
    </form>
  )
}
