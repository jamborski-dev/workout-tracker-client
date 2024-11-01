import { Page } from "@root/components/__shared/layout/Page"
import { FixMeLater } from "@root/types/FixMeLater"
import { FC } from "react"
import styled, { css } from "styled-components"
import GymPhoto from "@root/assets/gym.jpg"
import FamilyPhoto from "@root/assets/home.jpg"
import WorkPhoto from "@root/assets/work.jpg"
import { Link } from "react-router-dom"
import { Logo } from "@root/components/Logo"

const routes = [
  {
    path: "/routines",
    title: "Fitness",
    image: GymPhoto,
    isEnabled: true
  },
  {
    path: "/",
    title: "Family",
    image: FamilyPhoto,
    isEnabled: false
  },
  {
    path: "/",
    title: "Work",
    image: WorkPhoto,
    isEnabled: false
  }
]

const Home = () => {
  return (
    <Page headerComponent={<Logo />}>
      <RootRoutes>
        {routes.map((route, index) => (
          <RouteCard key={index} route={route} index={index} />
        ))}
      </RootRoutes>
    </Page>
  )
}

export default Home

const RouteCard: FC<{ route: FixMeLater; index: number }> = ({ route, index }) => {
  const position = index % 2 === 0 ? "left" : "right"
  return (
    <Card to={route.path} $isEnabled={route.isEnabled} $index={index}>
      <ImageWrapper>
        <Image src={route.image} alt={route.title} />
        <Title $position={position}>{route.title}</Title>
        <Gradient $position={position} />
      </ImageWrapper>
    </Card>
  )
}

const RootRoutes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 2rem;
  gap: 1rem;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`

const Card = styled(Link)<{ $isEnabled: boolean; $index: number }>`
  width: 80%;
  max-width: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;

  ${({ $isEnabled }) =>
    !$isEnabled
      ? css`
          filter: grayscale(1);
          user-select: none;
          cursor: not-allowed;
          opacity: 0.5;
        `
      : css`
          &:hover ${Image} {
            transform: scale(1.05);
          }
        `}
`

const ImageWrapper = styled.div`
  position: relative;
  display: grid;
  aspect-ratio: 16 / 5;
`

type PositionProps = {
  $position: "left" | "right"
}

const Title = styled.h4<PositionProps>`
  position: absolute;
  top: 1rem;
  ${({ $position }) => $position}: 1.5rem;
  color: white;
  z-index: 2;
  font-size: 1.7rem;
  font-weight: 200;
`

const Gradient = styled.div<PositionProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    ${({ $position }) => ($position === "left" ? "to right" : "to left")},
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
`
