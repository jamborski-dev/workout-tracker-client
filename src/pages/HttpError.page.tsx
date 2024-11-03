import { PrimaryButton } from "@root/components/__shared/Button"
import { NoAuthPage } from "@root/templates/NoAuthPage"
import { FC } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

interface HttpErrorPageProps {
  code: number
  status: string
  text: string
  action: {
    label: string
    to: string
  }
}

export const HttpErrorPage: FC<HttpErrorPageProps> = ({ code, status, text, action }) => {
  return (
    <NoAuthPage>
      <Container>
        <h1>
          ${code}: {status}
        </h1>
        <p>{text}.</p>
        <Link to={action.to}>
          <PrimaryButton>{action.label}</PrimaryButton>
        </Link>
      </Container>
    </NoAuthPage>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`
