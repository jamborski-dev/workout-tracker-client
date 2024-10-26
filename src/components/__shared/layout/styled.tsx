import styled from "styled-components"

export const Stack = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;

  & > * {
    grid-area: 1 / 1 / -1 / -1;
  }
`
