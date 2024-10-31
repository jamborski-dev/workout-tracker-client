import { FC } from "react"
import styled from "styled-components"
import { IconButton } from "./Button"

type Action = {
  callback: () => void
  label: string
  icon: React.ReactNode
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
          <ActionContainer>
            <IconButton onClick={action.callback} $size="lg">
              {action.icon}
            </IconButton>
            <ActionLabel>{action.label}</ActionLabel>
          </ActionContainer>
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
`

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const ActionLabel = styled.div``

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
