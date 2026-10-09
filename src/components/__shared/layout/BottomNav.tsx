import { IoIosFitness, IoIosLogOut } from "react-icons/io"
import { IoColorPaletteOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import { useAppSelector } from "@root/store/hooks/store"
import { IoFitness } from "react-icons/io5"
import { NavLink } from "react-router-dom"
import styled from "styled-components"

const menuItems = [
  { label: "Routines", path: "/routines", icon: IoFitness },
  { label: "Exercises", path: "/exercises ", icon: IoIosFitness },
  { label: "Settings", path: "/settings", icon: IoColorPaletteOutline },
  { label: "Logout", path: "/auth/logout", icon: IoIosLogOut }
  // { label: "Settings", path: "/settings" },
  // { label: "Profile", path: "/profile" },
]

export const BottomNav = () => {
  const isAdmin = useAppSelector(state => state.auth.user?.role === "ADMIN")
  const items = isAdmin
    ? [
        ...menuItems.slice(0, -2),
        { label: "Admin", path: "/admin", icon: IoShieldCheckmarkOutline },
        ...menuItems.slice(-2)
      ]
    : menuItems
  return (
    <Root>
      {items.map(item => {
        const Icon = item.icon
        return (
          <NavLink key={item.label} to={item.path.trim()}>
            <NavItem key={item.label}>
              <IconWrap className="icon">
                <Icon />
              </IconWrap>
              <span>{item.label}</span>
            </NavItem>
          </NavLink>
        )
      })}
    </Root>
  )
}

export const Root = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.5rem;
  color: var(--text-3);

  min-height: 3rem;
  padding-top: 0.6rem;
  padding-bottom: 0.4rem;
  padding-inline: 1rem;

  a {
    flex: 1;
    display: flex;
    justify-content: center;
    color: inherit;
  }

  a.active {
    color: var(--accent-text);
  }

  a.active .icon {
    background: var(--accent-gradient);
    color: var(--accent-contrast);
  }
`

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  white-space: nowrap;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  gap: 0.15rem;

  svg {
    font-size: 1.3rem;
  }
`

const IconWrap = styled.span`
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 1.8rem;
  border-radius: var(--radius-control);
  transition:
    background 0.2s,
    box-shadow 0.2s;
`
