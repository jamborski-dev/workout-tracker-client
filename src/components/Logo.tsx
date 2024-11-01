import { FC } from "react"
import { TbActivityHeartbeat } from "react-icons/tb"
import styled from "styled-components"

type Size = "sm" | "md" | "lg"
interface LogoProps {
  size?: Size
}

const sizeMap = {
  sm: 0.8,
  md: 1,
  lg: 2
}

export const Logo: FC<LogoProps> = ({ size = "md" }) => {
  return (
    <Root $size={size}>
      <TbActivityHeartbeat />
      <span>xis</span>
    </Root>
  )
}

const Root = styled.div<{ $size: Size }>`
  --size-multiplier: ${({ $size }) => sizeMap[$size]};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;

  > svg {
    font-size: calc(2rem * var(--size-multiplier));
    transform: translate(18%, -2%);
  }
  > span {
    font-size: calc(1.5rem * var(--size-multiplier));
  }
`
