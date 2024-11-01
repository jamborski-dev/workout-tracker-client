import { PrimaryButton } from "@root/components/__shared/Button"
import { NoAuthPage } from "@root/templates/NoAuthPage"
import { Link } from "react-router-dom"
import styled from "styled-components"

export const NotFound = () => {
  return (
    <NoAuthPage>
      <Container>
        <h1>404: Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/">
          <PrimaryButton>Go Back</PrimaryButton>
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
