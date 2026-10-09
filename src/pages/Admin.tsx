import { Page } from "@root/components/__shared/layout/Page"
import { PageHeader } from "@root/components/__shared/PageHeader"
import {
  AllowedEmail,
  addAllowedEmail,
  getAllowedEmails,
  getApiErrorMessage,
  removeAllowedEmail,
  sendInvite
} from "@root/services/admin.service"
import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"

const Admin = () => {
  const [entries, setEntries] = useState<AllowedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [role, setRole] = useState<AllowedEmail["role"]>("USER")
  const [note, setNote] = useState("")
  const [invite, setInvite] = useState(true)
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    try {
      setEntries(await getAllowedEmails())
      setError(null)
    } catch (e) {
      setError(getApiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id)
    try {
      await fn()
      await load()
    } catch (e) {
      setError(getApiErrorMessage(e))
    } finally {
      setBusyId(null)
    }
  }

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await addAllowedEmail({ email, role, note: note || undefined, sendInvite: invite })
      setEmail("")
      setNote("")
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  const status = (a: AllowedEmail) =>
    a.user ? "Signed up" : a.inviteSentAt ? "Invited" : "Allowed"

  return (
    <Page headerComponent={<PageHeader title="Admin" />}>
      <Root>
        <h3>Allowed emails</h3>
        <p>Only these addresses can sign in or sign up. Sign-in is by Google or an emailed link.</p>

        <AddForm onSubmit={onAdd}>
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Note (optional)"
            maxLength={200}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <Row>
            <select value={role} onChange={e => setRole(e.target.value as AllowedEmail["role"])}>
              <option value="USER">User</option>
              <option value="TESTER">Tester</option>
              <option value="ADMIN">Admin</option>
            </select>
            <label>
              <input type="checkbox" checked={invite} onChange={e => setInvite(e.target.checked)} />{" "}
              Send invite email
            </label>
          </Row>
          <button type="submit" disabled={adding}>
            {adding ? "Adding..." : "Add"}
          </button>
        </AddForm>

        {error && <ErrorText>{error}</ErrorText>}
        {loading && <p>Loading...</p>}

        <List>
          {entries.map(a => (
            <Item key={a.id}>
              <div>
                <strong>{a.email}</strong>
                <small>
                  {a.role} · {status(a)}
                  {a.note ? ` · ${a.note}` : ""}
                </small>
              </div>
              <Row>
                {!a.user && (
                  <button disabled={busyId === a.id} onClick={() => run(a.id, () => sendInvite(a.id))}>
                    {a.inviteSentAt ? "Resend" : "Invite"}
                  </button>
                )}
                <button
                  disabled={busyId === a.id}
                  onClick={() => {
                    if (window.confirm(`Remove ${a.email} from the allowlist?`)) {
                      run(a.id, () => removeAllowedEmail(a.id))
                    }
                  }}
                >
                  Remove
                </button>
              </Row>
            </Item>
          ))}
        </List>
      </Root>
    </Page>
  )
}

const Root = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  p {
    font-size: 0.85rem;
    color: #666;
  }
`

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input[type="email"],
  input[type="text"],
  select {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }
`

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #eee;

  > div:first-child {
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-break: break-all;
  }
  small {
    color: #888;
  }
`

const ErrorText = styled.span`
  color: #d9534f;
  font-size: 0.875rem;
`

export default Admin
