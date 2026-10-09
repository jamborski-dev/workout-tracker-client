import { NoAuthPage } from "@root/templates/NoAuthPage"
import { useForm } from "react-hook-form"
import { LoginPayload } from "@store/slices/auth/auth.types"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { Button } from "@root/components/__shared/Button"
import { loginUserAction } from "@root/store/slices/auth/auth.thunks"
import { RootState } from "@root/store/store"
import { authClient } from "@root/lib/auth-client"
import { useState } from "react"
import {
  Divider,
  ErrorMessage,
  FormGroup,
  FormInput,
  FormLabel,
  InfoMessage,
  SecondaryButton,
  StyledForm,
  StyledFormContainer
} from "./auth.styled"

const OAUTH_ERRORS: Record<string, string> = {
  access_denied: "Sign-in was cancelled.",
  signup_disabled: "This email has not been invited yet.",
  unable_to_create_user: "This email has not been invited yet.",
  INVALID_TOKEN: "That sign-in link is invalid or has expired. Request a new one."
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors }
  } = useForm<LoginPayload>()
  const apiError = useAppSelector(state => state.auth.error)
  const isLoading = useAppSelector(state => state.auth.isLoading)
  const user = useAppSelector((state: RootState) => state.auth.user)
  const isAuthChecked = useAppSelector((state: RootState) => state.auth.isAuthChecked)
  const [params] = useSearchParams()
  const [notice, setNotice] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const urlError = params.get("error")
  const urlErrorText = urlError ? (OAUTH_ERRORS[urlError] ?? "Sign-in failed. Please try again.") : null

  const onSubmit = async (data: LoginPayload) => {
    setNotice(null)
    setLocalError(null)
    try {
      await dispatch(loginUserAction(data)).unwrap()
      navigate("/")
    } catch (error) {
      console.error("Login failed: ", error)
    }
  }

  const onGoogle = async () => {
    setNotice(null)
    setLocalError(null)
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" })
    if (error) setLocalError(error.message || "Google sign-in is not available")
  }

  const onMagicLink = async () => {
    setNotice(null)
    setLocalError(null)
    if (!(await trigger("email"))) return
    setBusy(true)
    const { error } = await authClient.signIn.magicLink({
      email: getValues("email"),
      callbackURL: "/"
    })
    setBusy(false)
    if (error) {
      setLocalError(error.message || "Could not send the link")
      return
    }
    // Same message whether or not the address is invited (no account enumeration)
    setNotice("If this email is invited, a sign-in link is on its way.")
  }

  if (user && isAuthChecked) {
    // If user is logged in and auth state is checked, redirect to home page
    return <Navigate to="/" replace />
  }

  return (
    <NoAuthPage>
      <StyledFormContainer>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <SecondaryButton onClick={onGoogle}>Continue with Google</SecondaryButton>
          <Divider>or</Divider>

          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && typeof errors.email.message === "string" && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              type="password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && typeof errors.password.message === "string" && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <Button
            type="submit"
            label="Login"
            loadingText="Authenticating..."
            isLoading={isLoading}
          />
          <SecondaryButton onClick={onMagicLink} disabled={busy}>
            {busy ? "Sending..." : "Email me a sign-in link"}
          </SecondaryButton>
          <Link to="/auth/forgot">Forgot or need to set a password?</Link>

          {notice && <InfoMessage>{notice}</InfoMessage>}
          {(apiError || localError || urlErrorText) && (
            <ErrorMessage>{localError || apiError || urlErrorText}</ErrorMessage>
          )}
        </StyledForm>
      </StyledFormContainer>
    </NoAuthPage>
  )
}
