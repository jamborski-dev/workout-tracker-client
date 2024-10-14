/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, PropsWithChildren } from "react"
import { RightPanel } from "@components/RightPanel/RightPanel"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { selectRightPanel, setRightPanel } from "@store/slices/page/page.slice"
import { FaUserNinja } from "react-icons/fa6"
import { GrHomeOption } from "react-icons/gr"
import { ImList2 } from "react-icons/im"
import { Link } from "react-router-dom"
import styled from "styled-components"

export const MainTemplate: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()
  const rightPanelState = useAppSelector(selectRightPanel)

  const onOverlayClick = () => {
    dispatch(setRightPanel(undefined))
  }

  return (
    <Main>
      {/* <Menu>
        <PrimaryNav>
          <NavItem label="Home" route="/" Icon={GrHomeOption} />
          <NavItem label="Routines" route="/routines" Icon={ImList2} />
          <NavItem label="Profile" route="/profile" Icon={FaUserNinja} />
        </PrimaryNav>
      </Menu> */}
      <Content>
        {children}
        {Boolean(rightPanelState) && <Overlay onClick={onOverlayClick} />}
        <RightPanel />
      </Content>
    </Main>
  )
}

interface NavItemProps {
  route: string
  label: string
  Icon: FC
  iconClass?: string
}

const NavItem: FC<NavItemProps> = ({ route, label, Icon }) => {
  return (
    <NavListItem>
      <Link to={route}>
        <Icon />
        <NavLabel>{label}</NavLabel>
      </Link>
    </NavListItem>
  )
}

const Main = styled.main`
  min-height: 95vh;
  max-height: 90vh;
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
  border-radius: 3rem;
  overflow: hidden;

  background: white;

  box-shadow: 0 0 10px rgb(0, 0, 0, 0.1);
`

const Menu = styled.aside`
  position: relative;

  grid-area: block_menu;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  background-color: var(--color-primary);
  color: #ffffff;
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

const Nav = styled.ul`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-evenly;
  gap: 2rem;
  padding: 0.5rem;
`

const PrimaryNav = styled(Nav)`
  position: relative;
`

const NavLabel = styled.span`
  position: absolute;
  left: 2.2rem;
  top: 50%;
  transform: translateY(-50%) translateX(-100%);
  background-color: rgb(45, 50, 215);
  box-shadow: 0 1px 4px rgb(0, 0, 0, 0.3);
  color: rgb(255, 255, 255);
  border-radius: 40px;
  padding: 6px 16px;
  white-space: nowrap;
  font-size: 0.7rem;
  z-index: 999;
  opacity: 0;

  transition: {
    property: opacity, transform;
    duration: 0.2s;
    timing-function: ease-in-out;
  }
`

const NavListItem = styled.li`
  font-size: 1.2rem;
  display: grid;
  place-content: center;
  padding: 0.5rem;
  border-radius: 1000px;
  cursor: pointer;
  transition-property: color, background-color;
  transition-duration: 0.1s;

  svg {
    color: white;
  }

  a {
    max-height: 20px;
    position: relative;
  }

  &:hover {
    background-color: white;
    svg {
      color: #009baa;
    }
  }

  &:hover {
    box-shadow: 0 0 10px rgb(5, 223, 244);
  }

  &:hover ${NavLabel} {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
    transition-property: opacity, transform;
    transition-duration: 0.2s;
  }
`
