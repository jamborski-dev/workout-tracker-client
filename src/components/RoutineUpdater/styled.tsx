import styled from "styled-components"

export const HeaderAction = styled.div<{ $isActive: boolean }>`
  grid-area: block_header_action;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;

  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
`

export const Aside = styled.aside`
  grid-area: block_aside;
  aspect-ratio: 1;
  padding: 1rem;
  display: grid;
  padding-top: 0.4rem;
`

export const CountIndicator = styled.div`
  background: none;
  border: 1px solid #b5b5b5;
  border-radius: 1000px;
  width: 1.4rem;
  height: 1.4rem;
  position: relative;

  span {
    position: absolute;
    font-size: 0.7rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #656565;
  }
`

export const Section = styled.section<{ $isExpanded: boolean }>`
  padding-block: 1rem;
  padding-inline: 0.5rem 1rem;
  border-top: 1px solid #f1f1f1;

  display: grid;
  grid-template-columns: min-content 1fr min-content;
  grid-template-rows: auto auto ${({ $isExpanded }) => ($isExpanded ? "1fr" : "0fr")};
  grid-template-areas:
    "block_aside block_header block_header_action"
    "block_aside block_content block_header_action"
    "block_aside_2 block_expandable block_header_action";

  transition: border-left 0.3s, grid-template-rows 0.3s;

  & > * {
    padding-inline: 0.3rem;
  }

  border-left: ${({ $isExpanded }) =>
    $isExpanded ? "7px solid var(--app-accent)" : "0px solid transparent"};

  header {
    grid-area: block_header;
    span {
      font-size: 0.75rem;
      color: #191919;
      transition: color 0.6s;
      opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0.5)};
    }
  }

  /* h2 {
    // shared with select
    margin: 0;
    font-weight: 400;
    color: #616161;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;

    span {
      font-size: 1.4rem;
    }
  } */
`

export const SetRepPanel = styled.div<{ $isExpanded: boolean }>`
  font-size: 0.8rem;
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  grid-area: block_expandable;
  overflow: hidden;
  border-top: 0;

  header {
    display: flex;
    flex-direction: column;
  }

  ul {
    padding-inline: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;

    li {
      display: grid;
      grid-template-columns: repeat(2, 60px) 1fr;
      align-items: center;
      gap: 0.5rem;
      /* transform: translateX(calc((32px + 0.5rem) * -1)); */

      span {
        font-size: 0.7rem;
      }

      .set-label {
        text-align: right;
        color: #818181;
      }
    }
  }

  .checkbox-group {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  input {
    padding: 0.35rem 0.5rem;
    border-radius: 0.3rem;
    border: 1px solid #c9c9c9;

    &:hover {
      border-color: #399fff;
    }

    /* Hide the spinner in Chrome, Safari, Edge, and Opera */
    &[type="number"]::-webkit-outer-spin-button,
    &[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Hide the spinner in Firefox */
    &[type="number"] {
      appearance: textField;
    }
  }

  .weight-input {
    width: 60px;
    position: relative;

    input {
      width: 100%;
      background-color: transparent;
      z-index: 1;
    }

    span {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.7rem;
      color: #949494;
      z-index: 0;
      user-select: none;
    }
  }

  .add-set {
    background: none;
    border: none;
    color: #4391f1;
    cursor: pointer;
    width: max-content;
    display: flex;
    align-items: center;
    gap: 0.2rem;

    &:hover {
      color: #0558a6;
    }
  }
`
