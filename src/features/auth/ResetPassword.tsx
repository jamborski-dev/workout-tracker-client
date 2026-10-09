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

export const ResetPassword = () => {
  const [params] = useSearchParams()
  const token = params.get("token")
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(
    params.get("error") ? "That link is invalid or has expired. Request a new one." : null
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setBusy(true)
    setError(null)
    const { error } = await authClient.resetPassword({ newPassword: password, token })
    setBusy(false)
    if (error) {
      setError(error.message || "Could not set the password")
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
              <ErrorMessage>{error || "Missing reset token."}</ErrorMessage>
              <Link to="/auth/forgot">Request a new link</Link>
            </>
          ) : (
            <>
              <FormGroup>
                <FormLabel htmlFor="password">New password (min. 10 characters)</FormLabel>
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
              <Button type="submit" label="Set password" loadingText="Saving..." isLoading={busy} />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </>
          )}
        </StyledForm>
      </StyledFormContainer>
    </NoAuthPage>
  )
}
