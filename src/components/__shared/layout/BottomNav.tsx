import { IoIosFitness, IoIosLogOut } from "react-icons/io"
import { RiHomeLine } from "react-icons/ri"
import { Link } from "react-router-dom"
import styled from "styled-components"

const menuItems = [
  { label: "Home", path: "/", icon: RiHomeLine },
  { label: "Routines", path: "/routines", icon: IoIosFitness },
  { label: "Logout", path: "/auth/logout", icon: IoIosLogOut }
  // { label: "Settings", path: "/settings" },
  // { label: "Profile", path: "/profile" },
]

export const BottomNav = () => {
  return (
    <Root>
      {menuItems.map(item => {
        const Icon = item.icon
        return (
          <Link key={item.label} to={item.path}>
            <NavItem key={item.label}>
              <Icon />
              <span>{item.label}</span>
            </NavItem>
          </Link>
        )
      })}
    </Root>
  )
}

export const Root = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.5rem;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  color: #22222299;

  min-height: 3rem;
  padding-top: 1rem;
  padding-inline: 2rem;
`

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #22222299;
  cursor: pointer;
  padding: 0.5rem;

  svg {
    font-size: 1.5rem;
  }

  &.active {
    color: #222222;
  }
`
