import { NoAuthPage } from "@root/templates/NoAuthPage"
import { useForm } from "react-hook-form"

export const Register = () => {
  const { register } = useForm()

  return (
    <NoAuthPage>
      <form>
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")} />
        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" {...register("confirmPassword")} />
        <button type="submit">Register</button>
      </form>
    </NoAuthPage>
  )
}
