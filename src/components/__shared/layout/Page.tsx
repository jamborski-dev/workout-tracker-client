import { useAppSelector } from "@root/store/hooks/store"
import { selectTimer } from "@root/store/slices/app/app.slice"
import { FC, ReactNode } from "react"
import styled from "styled-components"
import { Timer } from "./Timer"
import { BottomNav } from "./BottomNav"

interface PageProps {
  headerComponent: ReactNode
  children: ReactNode
  renderTimer?: boolean
}

export const Page: FC<PageProps> = ({ headerComponent, children, renderTimer = false }) => {
  const timer = useAppSelector(selectTimer)
  return (
    <Root>
      <header>
        {headerComponent}
        {renderTimer ? <Timer key={timer} /> : null}
      </header>
      <main>{children}</main>
      <footer>
        <BottomNav />
      </footer>
    </Root>
  )
}

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
    text-align: center;
    border-top: 1px solid #e6e6e6;
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
      /* text-align: center; */
      color: #22222299;

      sup {
        font-size: 0.5rem;
      }
    }
  }
`
