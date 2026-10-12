import { IconButton } from "@root/components/__shared/Button"
import { useAppDispatch } from "@root/store/hooks/store"
import { createTemplateAction } from "@root/store/slices/templates/templates.thunks"
import { showToast } from "@store/slices/toast/toast.slice"
import { useState } from "react"
import { MdBookmarkAdd } from "react-icons/md"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

// "Save this routine as a template": asks for a name inline, then copies the plan on the server
export const SaveTemplate = ({
  routineId,
  defaultName,
  disabled
}: {
  routineId: number | string
  defaultName: string
  disabled?: boolean
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  const close = () => {
    setOpen(false)
    setSaving(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      await dispatch(
        createTemplateAction({ fromRoutineId: routineId, name: name.trim() || defaultName })
      ).unwrap()
      dispatch(showToast({ message: t("template.savedToast"), type: "success" }))
      close()
    } catch {
      // the global toast already reports the failure
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <IconButton
        aria-label={t("template.saveAs")}
        title={t("template.saveAs")}
        disabled={disabled}
        onClick={() => {
          setName(defaultName)
          setOpen(true)
        }}
      >
        <MdBookmarkAdd />
      </IconButton>
    )
  }

  return (
    <Row>
      <input
        aria-label={t("template.nameLabel")}
        type="text"
        maxLength={100}
        autoFocus
        value={name}
        onChange={event => setName(event.target.value)}
        onKeyDown={event => {
          if (event.key === "Enter") {
            event.preventDefault()
            if (!saving) save()
          }
          if (event.key === "Escape") close()
        }}
      />
      <Action type="button" onClick={save} disabled={saving} $primary>
        {saving ? t("template.saving") : t("template.save")}
      </Action>
      <Action type="button" onClick={close}>
        Cancel
      </Action>
    </Row>
  )
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1 1 100%;
  min-width: 0;

  input {
    flex: 1;
    min-width: 0;
  }
`

const Action = styled.button<{ $primary?: boolean }>`
  padding: 0.45rem 0.8rem;
  border: 1px solid ${({ $primary }) => ($primary ? "var(--accent)" : "var(--border-default)")};
  border-radius: var(--radius-control);
  background: ${({ $primary }) => ($primary ? "var(--accent)" : "transparent")};
  color: ${({ $primary }) => ($primary ? "var(--accent-contrast)" : "var(--text-2)")};
  font-size: 0.85rem;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
