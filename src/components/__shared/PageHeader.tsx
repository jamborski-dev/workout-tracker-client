import { FC, ReactNode } from "react"
import styled from "styled-components"
import { Button } from "./Button"

type Action = {
  callback: () => void
  label: string
  icon: ReactNode
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
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
          <Button
            onClick={action.callback}
            label={action.label}
            loadingText={action.loadingText}
            isLoading={action.isLoading}
            disabled={action.disabled}
          />
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
