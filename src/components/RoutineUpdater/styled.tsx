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
  /* aspect-ratio: 1; */
  padding: 0rem;
  display: flex;
  gap: 0.8rem;
  flex-direction: column;
  padding-top: 0.4rem;
`

export const CountIndicator = styled.div`
  aspect-ratio: 1/1;
  background: none;
  border: 1px solid var(--border-default);
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
    color: var(--text-2);
  }
`

export const Section = styled.section<{ $isExpanded: boolean }>`
  margin: 0.6rem 0.75rem;
  padding-block: 1rem;
  padding-inline: 0.5rem 1rem;
  border: 1px solid ${({ $isExpanded }) => ($isExpanded ? "var(--accent)" : "var(--card-border)")};
  border-radius: var(--radius-card);
  background: var(--surface);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--card-shadow);

  user-select: none;

  overflow: hidden;

  display: grid;
  grid-template-columns: min-content 1fr min-content;
  grid-template-rows: auto auto ${({ $isExpanded }) => ($isExpanded ? "1fr" : "0fr")};
  grid-template-areas:
    "block_aside block_header block_header_action"
    "block_aside block_content ."
    "block_aside block_expandable block_expandable";

  transition:
    border-color 0.3s,
    box-shadow 0.3s,
    grid-template-rows 0.3s;

  & > * {
    padding-inline: 0.3rem;
  }

  header {
    grid-area: block_header;
    position: relative;
    cursor: ${({ $isExpanded }) => ($isExpanded ? "default" : "pointer")};

    span {
      font-size: 0.75rem;
      color: var(--text-1);
      transition: color 0.6s;
      opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0.5)};
    }
  }

  h2 {
    // shared with select
    margin: 0;
    font-weight: 400;
    color: var(--text-2);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;

    span {
      font-size: 1.4rem;
    }
  }
`

export const SetRepPanel = styled.div<{ $isExpanded: boolean }>`
  font-size: 0.8rem;
  padding-block: 1rem;
  display: flex;
  flex-direction: column;
  grid-area: block_expandable;
  overflow: hidden;
  border-top: 0;
  gap: 1rem;

  header {
    display: flex;
    flex-direction: column;
  }

  ul {
    padding-inline: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;

    .set-grid {
      display: grid;
      grid-template-columns: repeat(3, 60px) min-content 1fr min-content;
      align-items: center;
      gap: 0.5rem;

      span {
        font-size: 0.7rem;
      }

      .set-label {
        text-align: right;
        color: var(--text-3);
      }

      .set-grip {
        justify-self: end;
        margin-left: auto;
      }

      .set-actions {
        justify-self: end;
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
    border: 1px solid var(--border-default);

    &:hover {
      border-color: var(--accent);
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
  }

  .add-set {
    background: none;
    border: none;
    color: var(--accent-text);
    cursor: pointer;
    width: max-content;
    display: flex;
    align-items: center;
    gap: 0.2rem;

    &:hover {
      color: var(--accent);
    }
  }
`
