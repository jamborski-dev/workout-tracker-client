import { useAppSelector } from "@root/store/hooks/store"
import { selectTimer } from "@root/store/slices/app/app.slice"
import { FC, ReactNode } from "react"
import styled from "styled-components"
import { Timer } from "./Timer"

interface PageProps {
  headerComponent: ReactNode
  footerComponent: ReactNode
  children: ReactNode
}

export const Page: FC<PageProps> = ({ headerComponent, footerComponent, children }) => {
  const timer = useAppSelector(selectTimer)
  return (
    <Root>
      <header>
        <Padding>{headerComponent}</Padding>
        <Timer key={timer} />
      </header>
      <main>{children}</main>
      <footer>{footerComponent}</footer>
    </Root>
  )
}

const Padding = styled.div`
  padding: 1rem;
`

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;

  > main {
    overflow-y: scroll;
    flex: 1;
  }

  > footer {
    min-height: 3rem;
    padding-inline: 2rem;
    text-align: center;
    border-top: 1px solid #e6e6e6;
    padding-top: 2rem;
  }

  > header {
    h4 {
      font-size: 1.2rem;
      margin: 0;
      font-weight: 400;
      text-align: center;
    }

    div {
      font-size: 0.8rem;
      text-align: center;
      color: #22222299;

      sup {
        font-size: 0.5rem;
      }
    }
  }
`
