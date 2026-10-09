import styled from "styled-components"

export const NegativeAmount = styled.span`
  color: var(--danger);
`

export const Text = styled.p<{ $align?: "left" | "center" | "right" }>`
  text-align: ${({ $align }) => $align ?? "center"};
  padding-block: 1rem;
  margin: 0;
  color: var(--text-3);
`
