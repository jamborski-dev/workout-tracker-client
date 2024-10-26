import { FC } from "react"
import styled from "styled-components"

type SwitchProps = {
  isOn: boolean
  labels?: {
    on: string
    off: string
  }
  onChange: () => void
}

export const SwitchToggle: FC<SwitchProps> = ({
  isOn = false,
  labels = { on: "On", off: "Off" },
  onChange
}) => {
  const handleOnClick = () => {
    onChange()
  }

  return (
    <Root>
      <ToggleRoot $isOn={isOn} onClick={handleOnClick}>
        <Toggle $isOn={isOn} />
      </ToggleRoot>
      <Label>{!isOn ? labels.on : labels.off}</Label>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 6rem;
`

type SwitchToggleRootProps = { $isOn: boolean }

const ToggleRoot = styled.div<SwitchToggleRootProps>`
  --size: 1.4rem;
  width: calc(var(--size) * 1.8);
  height: var(--size);
  border-radius: 10rem;
  background: ${({ $isOn }) => ($isOn ? "#dadada" : "#adeded")};
  position: relative;

  box-shadow: inset 0 0 5px 1px ${({ $isOn }) => ($isOn ? "#37373734" : "#2ab0d99a")};
  transition: background 0.3s, box-shadow 0.3s;

  cursor: pointer;
`

const Toggle = styled.span<SwitchToggleRootProps>`
  height: 70%;
  aspect-ratio: 1 / 1;
  border-radius: 10rem;
  display: inline-block;
  background: white;
  position: absolute;
  top: 50%;
  left: 10%;

  transition: transform 0.3s;
  transform: translate(${({ $isOn }) => (!$isOn ? "110%" : "0%")}, -50%);
`

const Label = styled.span`
  font-size: 0.8rem;
  color: #616161;
  user-select: none;
`
