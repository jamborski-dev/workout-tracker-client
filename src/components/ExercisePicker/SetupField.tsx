import type { FC } from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

// Short machine setting / configuration for an exercise ("H64", "30°", "rope"). Kept short on purpose.
export const SetupField: FC<{ value?: string | null; onChange: (value: string) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation()
  return (
  <Input
    type="text"
    maxLength={60}
    placeholder={t("setup.placeholder")}
    aria-label={t("setup.label")}
    value={value ?? ""}
    onChange={event => onChange(event.target.value)}
  />
  )
}

const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--text-2);
  font-size: 0.75rem;

  &:focus {
    border-color: var(--accent);
    outline: none;
  }
`
