import LoaderSVG from "@root/assets/loading-eclipse.svg"
import type { FC } from "react"
import styled from "styled-components"
import { Text } from "./Typography"

interface FullPageLoaderProps {
  text?: string
}

export const FullPageLoader: FC<FullPageLoaderProps> = ({ text = "Loading..." }) => {
  return (
    <Container>
      <LoaderSVG />
      <Text>{text}</Text>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`
