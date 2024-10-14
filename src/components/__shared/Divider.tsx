import styled from "styled-components"

export const Divider = styled.hr<{ $inverse?: boolean }>`
  --amount: ${({ $inverse }) => ($inverse ? "0" : "255")};
  border: none;
  border-top: 1px solid rgb(var(--amount), var(--amount), var(--amount), 0.1);
  margin: 1rem 0;
`
