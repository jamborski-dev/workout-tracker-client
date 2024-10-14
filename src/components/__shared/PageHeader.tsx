import { FC } from "react"
import { PrimaryButton } from "./Button"
import styled from "styled-components"

type Action = {
  callback: () => void
  label: string
}

interface PageHeaderProps {
  title: string
  brew?: string
  action?: Action
}

export const PageHeader: FC<PageHeaderProps> = ({ title, brew, action }) => {
  return (
    <Header>
      <Title>
        <h1>{title}</h1>
        {brew && <h2>{brew}</h2>}
      </Title>
      {action && (
        <Action>
          <PrimaryButton onClick={action.callback} type="button">
            {action.label}
          </PrimaryButton>
        </Action>
      )}
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;

  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
`

const Title = styled.div`
  flex: 1;

  h1 {
    margin-bottom: 0.3rem;
    font-size: 1.5rem;
  }

  h2 {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 400;
  }
`

const Action = styled.div`
  display: flex;
  align-items: center;
`
