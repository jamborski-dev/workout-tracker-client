import { NoAuthPage } from "@root/templates/NoAuthPage"
import { Button } from "@root/components/__shared/Button"
import { authClient } from "@root/lib/auth-client"
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ErrorMessage,
  FormGroup,
  FormInput,
  FormLabel,
  InfoMessage,
  StyledForm,
  StyledFormContainer
} from "./auth.styled"
import { useTranslation } from "react-i18next"

export const ForgotPassword = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/auth/reset"
    })
    setBusy(false)
    if (error) {
      setError(error.message || t("auth.emailFailed"))
      return
    }
    setNotice(t("auth.resetSent"))
  }

  return (
    <NoAuthPage>
      <StyledFormContainer>
        <StyledForm onSubmit={onSubmit}>
          <FormGroup>
            <FormLabel htmlFor="email">{t("auth.email")}</FormLabel>
            <FormInput
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <Button type="submit" label={t("auth.sendLink")} loadingText={t("auth.sending")} isLoading={busy} />
          <Link to="/auth/login">{t("auth.backToLogin")}</Link>
          {notice && <InfoMessage>{notice}</InfoMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </StyledForm>
      </StyledFormContainer>
    </NoAuthPage>
  )
}
