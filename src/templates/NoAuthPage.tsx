import { Logo } from "@root/components/Logo"
import type { FC } from "react"
import styled from "styled-components"

interface NoAuthPageProps {
  children: React.ReactNode
}

export const NoAuthPage: FC<NoAuthPageProps> = ({ children }) => {
  return (
    <Page>
      <header>
        <Logo />
      </header>
      <main>{children}</main>
    </Page>
  )
}

const Page = styled.div`
  display: grid;
  grid-template-rows: 1fr 4fr;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  > header {
    font-size: 2rem;
  }
`
