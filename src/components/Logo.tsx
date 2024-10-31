import { TbActivityHeartbeat } from "react-icons/tb"
import styled from "styled-components"

export const Logo = () => {
  return (
    <Root>
      <TbActivityHeartbeat />
      <span>Organ</span>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  > svg {
    font-size: 2rem;
  }
  > span {
    font-size: 1.5rem;
  }
`
