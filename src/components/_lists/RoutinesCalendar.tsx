import type { Routine } from "@root/types/data"
import { type FC, useMemo, useState } from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import i18n from "@root/i18n"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

// Intl gives localised names; 2024-01-01 is a Monday
const weekdayNames = (locale: string) =>
  Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, 1 + index))
  )
const monthName = (locale: string, month: number) =>
  new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2024, month, 1))

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const typeName = (routine: Routine) =>
  (typeof routine.routineType === "string" ? routine.routineType : routine.routineType?.name) || i18n.t("routines.uncategorized")

interface RoutinesCalendarProps {
  routines: Routine[]
}

// Month grid marking the days with a logged routine. Neutral by design: no streaks or "missed" days.
export const RoutinesCalendar: FC<RoutinesCalendarProps> = ({ routines }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const today = new Date()
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)

  const byDay = useMemo(() => {
    const map = new Map<string, Routine[]>()
    for (const routine of routines) {
      const key = dayKey(new Date(routine.date))
      map.set(key, [...(map.get(key) ?? []), routine])
    }
    return map
  }, [routines])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7 // Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]

  const monthCount = cells.filter(day => day && byDay.has(dayKey(new Date(year, month, day)))).length
  const shift = (delta: number) => {
    setSelected(null)
    setCursor(new Date(year, month + delta, 1))
  }

  const openDay = (key: string) => {
    const items = byDay.get(key)
    if (!items) return
    if (items.length === 1) navigate(`/routines/${items[0].id}`)
    else setSelected(key)
  }

  const todayKey = dayKey(today)
  const selectedRoutines = selected ? (byDay.get(selected) ?? []) : []

  return (
    <Root>
      <Head>
        <NavButton type="button" aria-label={t("calendar.prev")} onClick={() => shift(-1)}>
          <MdChevronLeft />
        </NavButton>
        <div>
          <strong>
            {monthName(i18n.language, month)} {year}
          </strong>
          <small>{t("calendar.trained", { count: monthCount })}</small>
        </div>
        <NavButton type="button" aria-label={t("calendar.next")} onClick={() => shift(1)}>
          <MdChevronRight />
        </NavButton>
      </Head>

      <Grid>
        {weekdayNames(i18n.language).map(day => (
          <span key={day} className="weekday">
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />
          const key = dayKey(new Date(year, month, day))
          const items = byDay.get(key)
          return (
            <Day
              key={key}
              type="button"
              disabled={!items}
              data-trained={Boolean(items)}
              data-today={key === todayKey}
              data-selected={key === selected}
              aria-label={items ? `${day} ${monthName(i18n.language, month)}: ${items.map(typeName).join(", ")}` : `${day} ${monthName(i18n.language, month)}`}
              onClick={() => openDay(key)}
            >
              {day}
            </Day>
          )
        })}
      </Grid>

      {selectedRoutines.length > 0 && (
        <Picked>
          {selectedRoutines.map(routine => (
            <button key={routine.id} type="button" onClick={() => navigate(`/routines/${routine.id}`)}>
              {typeName(routine)}
            </button>
          ))}
        </Picked>
      )}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem 1rem;
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-1);
  }

  small {
    font-size: 0.7rem;
    color: var(--text-3);
  }
`

const NavButton = styled.button`
  display: inline-flex;
  padding: 0.3rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--text-2);
  font-size: 1.3rem;
  cursor: pointer;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: min-content;
  gap: 0.3rem;

  .weekday {
    text-align: center;
    font-size: 0.65rem;
    color: var(--text-3);
  }
`

const Day = styled.button`
  width: 100%;
  min-width: 0;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--text-3);
  font-size: 0.8rem;
  cursor: default;

  &[data-trained="true"] {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-contrast);
    font-weight: 600;
    cursor: pointer;
  }

  &[data-today="true"]:not([data-trained="true"]) {
    border-color: var(--accent);
    color: var(--text-1);
  }

  &[data-selected="true"] {
    outline: 2px solid var(--text-1);
    outline-offset: 1px;
  }
`

const Picked = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  button {
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--accent);
    border-radius: var(--radius-control);
    background: var(--accent-soft);
    color: var(--text-1);
    cursor: pointer;
  }
`
