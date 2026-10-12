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
import { useTranslation } from "react-i18next"

const OAUTH_ERRORS = ["access_denied", "signup_disabled", "unable_to_create_user", "INVALID_TOKEN"]

export const Login = () => {
  const { t } = useTranslation()
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
  const urlErrorText = urlError ? t(OAUTH_ERRORS.includes(urlError) ? `auth.oauth.${urlError}` : "auth.oauth.fallback") : null

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
    if (error) setLocalError(error.message || t("auth.googleUnavailable"))
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
      setLocalError(error.message || t("auth.linkFailed"))
      return
    }
    // Same message whether or not the address is invited (no account enumeration)
    setNotice(t("auth.linkSent"))
  }

  if (user && isAuthChecked) {
    // If user is logged in and auth state is checked, redirect to home page
    return <Navigate to="/" replace />
  }

  return (
    <NoAuthPage>
      <StyledFormContainer>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <SecondaryButton onClick={onGoogle}>{t("auth.continueGoogle")}</SecondaryButton>
          <Divider>{t("auth.or")}</Divider>

          <FormGroup>
            <FormLabel htmlFor="email">{t("auth.email")}</FormLabel>
            <FormInput
              type="email"
              autoComplete="email"
              {...register("email", { required: t("auth.emailRequired") })}
            />
            {errors.email && typeof errors.email.message === "string" && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">{t("auth.password")}</FormLabel>
            <FormInput
              type="password"
              autoComplete="current-password"
              {...register("password", { required: t("auth.passwordRequired") })}
            />
            {errors.password && typeof errors.password.message === "string" && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <Button
            type="submit"
            label={t("auth.login")}
            loadingText={t("auth.authenticating")}
            isLoading={isLoading}
          />
          <SecondaryButton onClick={onMagicLink} disabled={busy}>
            {busy ? t("auth.sending") : t("auth.emailLink")}
          </SecondaryButton>
          <Link to="/auth/forgot">{t("auth.forgot")}</Link>

          {notice && <InfoMessage>{notice}</InfoMessage>}
          {(apiError || localError || urlErrorText) && (
            <ErrorMessage>{localError || apiError || urlErrorText}</ErrorMessage>
          )}
        </StyledForm>
      </StyledFormContainer>
    </NoAuthPage>
  )
}
