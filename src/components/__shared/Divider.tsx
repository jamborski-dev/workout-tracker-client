import styled from "styled-components"

export const Divider = styled.hr<{ $inverse?: boolean }>`
  --amount: ${({ $inverse }) => ($inverse ? "0" : "255")};
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: 1rem 0;
`
