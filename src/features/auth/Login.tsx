import { NoAuthPage } from "@root/templates/NoAuthPage"
import { useForm } from "react-hook-form"
import { LoginPayload } from "@store/slices/auth/auth.slice"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import styled from "styled-components"
import { PrimaryButton } from "@root/components/__shared/Button"
import { loginUserAction } from "@root/store/slices/auth/auth.thunks"

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginPayload>()
  const apiError = useAppSelector(state => state.auth.error)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginPayload) => {
    try {
      await dispatch(loginUserAction(data)).unwrap()
      navigate("/")
    } catch (error) {
      console.error("Login failed: ", error)
    }
  }

  return (
    <NoAuthPage>
      <StyledFormContainer>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput type="email" {...register("email", { required: "Email is required" })} />
            {errors.email && typeof errors.email.message === "string" && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && typeof errors.password.message === "string" && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <PrimaryButton type="submit">Login</PrimaryButton>
          {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
        </StyledForm>
      </StyledFormContainer>
    </NoAuthPage>
  )
}

const StyledFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 14rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: 300;
`

const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    border-color: var(--app-accent);
  }
`

const ErrorMessage = styled.span`
  color: #d9534f;
  font-size: 0.875rem;
`
