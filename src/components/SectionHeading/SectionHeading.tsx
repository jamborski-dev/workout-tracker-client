import { FC } from "react"
import { Pulse } from "../loading/Pulse"
import styled from "styled-components"

interface SectionHeadingProps {
  title: string
  brew?: string
  loading?: boolean
}

export const SectionHeading: FC<SectionHeadingProps> = ({ title, brew, loading }) => {
  return (
    <Header>
      <Top>
        <Title>{title}</Title>
        <Spinner play={loading} />
      </Top>
      {brew && <Brew>{brew}</Brew>}
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  margin-bottom: 1rem;
`

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 400;
`

const Brew = styled.p`
  margin: 0;
  font-size: 1rem;
`

const Spinner = styled(Pulse)`
  --size: 1.3rem;
  width: var(--size);
  height: var(--size);
`
