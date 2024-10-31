import { NoAuthPage } from "@root/templates/NoAuthPage"
import { useForm } from "react-hook-form"
import { LoginPayload, loginUser } from "@store/slices/auth/auth.slice"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@root/store/hooks/store"
import styled from "styled-components"

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginPayload>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginPayload) => {
    try {
      await dispatch(loginUser(data)).unwrap()
      navigate("/")
    } catch (error) {
      console.error("Login failed: ", error)
    }
  }

  return (
    <NoAuthPage>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email", { required: "Email is required" })} />
        {errors.email && typeof errors.email.message === "string" && (
          <span>{errors.email.message}</span>
        )}

        <label htmlFor="password">Password</label>
        <input type="password" {...register("password", { required: "Password is required" })} />
        {errors.password && typeof errors.password.message === "string" && (
          <span>{errors.password.message}</span>
        )}

        <button type="submit">Login</button>
      </Form>
    </NoAuthPage>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
