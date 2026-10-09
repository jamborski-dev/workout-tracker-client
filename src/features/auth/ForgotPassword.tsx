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

export const ForgotPassword = () => {
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
      setError(error.message || "Could not send the email")
      return
    }
    setNotice("If an account exists for this email, a link to set a password is on its way.")
  }

  return (
    <NoAuthPage>
      <StyledFormContainer>
        <StyledForm onSubmit={onSubmit}>
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <Button type="submit" label="Send link" loadingText="Sending..." isLoading={busy} />
          <Link to="/auth/login">Back to login</Link>
          {notice && <InfoMessage>{notice}</InfoMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </StyledForm>
      </StyledFormContainer>
    </NoAuthPage>
  )
}
