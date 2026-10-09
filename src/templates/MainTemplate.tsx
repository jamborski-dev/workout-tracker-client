/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, PropsWithChildren } from "react"
// import { RightPanel } from "@components/RightPanel/RightPanel"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { selectRightPanel, setRightPanel } from "@store/slices/page/page.slice"
// import { FaUserNinja } from "react-icons/fa6"
// import { GrHomeOption } from "react-icons/gr"
// import { ImList2 } from "react-icons/im"
import styled from "styled-components"

export const MainTemplate: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()
  const rightPanelState = useAppSelector(selectRightPanel)

  const onOverlayClick = () => {
    dispatch(setRightPanel(undefined))
  }

  return (
    <Main>
      <Content>
        {children}

        {Boolean(rightPanelState) && <Overlay onClick={onOverlayClick} />}
        {/* <RightPanel /> */}
      </Content>
    </Main>
  )
}

const Main = styled.main`
  // use this these to simulate phone look
  /* min-height: 95vh; */
  /* max-height: 90vh; */
  /* border-radius: 3rem; */
  position: relative;
  display: grid;
  grid-template-areas:
    "block_content"
    "block_menu   ";
  grid-template-columns: auto;
  grid-template-rows: 1fr min-content;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  background-color: var(--app-bg);

  box-shadow: 0 0 10px rgb(0, 0, 0, 0.1);
  max-width: 500px;
`

const Content = styled.div`
  position: relative;
  grid-area: block_content;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background-color: rgb(0, 0, 0, 0.5);
`
