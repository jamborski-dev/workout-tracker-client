import { IoIosFitness, IoIosLogOut } from "react-icons/io"
import { IoShieldCheckmarkOutline } from "react-icons/io5"
import { useAppSelector } from "@root/store/hooks/store"
import { IoFitness } from "react-icons/io5"
import { Link } from "react-router-dom"
import styled from "styled-components"

const menuItems = [
  { label: "Routines", path: "/routines", icon: IoFitness },
  { label: "Exercise List", path: "/exercises ", icon: IoIosFitness },
  { label: "Logout", path: "/auth/logout", icon: IoIosLogOut }
  // { label: "Settings", path: "/settings" },
  // { label: "Profile", path: "/profile" },
]

export const BottomNav = () => {
  const isAdmin = useAppSelector(state => state.auth.user?.role === "ADMIN")
  const items = isAdmin
    ? [
        ...menuItems.slice(0, -1),
        { label: "Admin", path: "/admin", icon: IoShieldCheckmarkOutline },
        ...menuItems.slice(-1)
      ]
    : menuItems
  return (
    <Root>
      {items.map(item => {
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
