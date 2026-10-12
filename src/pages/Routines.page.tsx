import { PageHeader } from "@root/components/__shared/PageHeader"
import { RoutinesList } from "@root/components/_lists/RoutinesList"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { Page } from "@root/components/__shared/layout/Page"
import { selectList, selectRoutinesLoading } from "@root/store/slices/routines/routines.selectors"
import { getAllRoutinesAction } from "@root/store/slices/routines/routines.thunks"
import { selectUserId } from "@root/store/slices/user/user.selectors"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { MdCalendarMonth, MdViewList } from "react-icons/md"
import { RoutinesCalendar } from "@root/components/_lists/RoutinesCalendar"
import { useNavigate } from "react-router-dom"
import { IoCreateOutline } from "react-icons/io5"
import { useTranslation } from "react-i18next"

type View = "list" | "calendar"
const VIEW_KEY = "axis:routines-view"

const readView = (): View => {
  try {
    return localStorage.getItem(VIEW_KEY) === "calendar" ? "calendar" : "list"
  } catch {
    return "list"
  }
}

const RoutinesPage = () => {
  const { t } = useTranslation()
  const [view, setView] = useState<View>(readView)
  const chooseView = (next: View) => {
    setView(next)
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {
      // preference is optional
    }
  }

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handlePageAction = () => {
    navigate("/routines/new")
  }

  const userId = useAppSelector(selectUserId)
  const isLoading = useAppSelector(selectRoutinesLoading)
  const routines = useAppSelector(selectList) || []

  useEffect(() => {
    if (!userId) return

    dispatch(getAllRoutinesAction())
  }, [dispatch, userId])

  return (
    <Page
      headerComponent={
        <PageHeader
          title={t("routines.title")}
          action={{
            callback: handlePageAction,
            label: t("routines.new"),
            icon: <IoCreateOutline />
          }}
        />
      }
    >
      <Toggle role="group" aria-label={t("routines.viewGroup")}>
        <button type="button" aria-label={t("routines.listView")} aria-pressed={view === "list"} onClick={() => chooseView("list")}>
          <MdViewList />
        </button>
        <button
          type="button"
          aria-label={t("routines.calendarView")}
          aria-pressed={view === "calendar"}
          onClick={() => chooseView("calendar")}
        >
          <MdCalendarMonth />
        </button>
      </Toggle>
      {view === "calendar" ? (
        <RoutinesCalendar routines={routines} />
      ) : (
        <RoutinesList routines={routines} isLoading={isLoading} />
      )}
    </Page>
  )
}

const Toggle = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem 0;

  button {
    display: inline-flex;
    padding: 0.35rem;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-control);
    background: transparent;
    color: var(--text-3);
    font-size: 1.2rem;
    cursor: pointer;
  }

  button[aria-pressed="true"] {
    border-color: var(--accent);
    background: var(--accent-soft);
    color: var(--text-1);
  }
`

export default RoutinesPage
