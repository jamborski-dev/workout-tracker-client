import { NoAuthPage } from "@root/templates/NoAuthPage"
import { Button } from "@root/components/__shared/Button"
import { authClient } from "@root/lib/auth-client"
import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  ErrorMessage,
  FormGroup,
  FormInput,
  FormLabel,
  StyledForm,
  StyledFormContainer
} from "./auth.styled"
import { useTranslation } from "react-i18next"

export const ResetPassword = () => {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const token = params.get("token")
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(
    params.get("error") ? t("auth.linkInvalid") : null
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setBusy(true)
    setError(null)
    const { error } = await authClient.resetPassword({ newPassword: password, token })
    setBusy(false)
    if (error) {
      setError(error.message || t("auth.setPasswordFailed"))
      return
    }
    navigate("/auth/login")
  }

  return (
    <NoAuthPage>
      <StyledFormContainer>
        <StyledForm onSubmit={onSubmit}>
          {!token ? (
            <>
              <ErrorMessage>{error || t("auth.missingToken")}</ErrorMessage>
              <Link to="/auth/forgot">{t("auth.requestNewLink")}</Link>
            </>
          ) : (
            <>
              <FormGroup>
                <FormLabel htmlFor="password">{t("auth.newPassword")}</FormLabel>
                <FormInput
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </FormGroup>
              <Button type="submit" label={t("auth.setPassword")} loadingText={t("auth.saving")} isLoading={busy} />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </>
          )}
        </StyledForm>
      </StyledFormContainer>
    </NoAuthPage>
  )
}
