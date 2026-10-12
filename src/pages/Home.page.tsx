import { Page } from "@root/components/__shared/layout/Page"
import { Logo } from "@root/components/Logo"
import { RoutinesCalendar } from "@root/components/_lists/RoutinesCalendar"
import { getStats, type Stats } from "@root/services/stats.service"
import { useAppDispatch, useAppSelector } from "@root/store/hooks/store"
import { selectRoutineTypes } from "@root/store/slices/routineTypes/routineTypes.selectors"
import { getAllRoutineTypesAction } from "@root/store/slices/routineTypes/routineTypes.thunks"
import { selectList } from "@root/store/slices/routines/routines.selectors"
import { getAllRoutinesAction } from "@root/store/slices/routines/routines.thunks"
import { selectUserId } from "@root/store/slices/user/user.selectors"
import { suggestNextType } from "@root/utils/rotation"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const relativeDay = (iso: string, locale: string) => {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000)
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-Math.max(days, 0), "day")
}

const tonnes = (kg: number) => (kg / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })

const Home = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userId = useAppSelector(selectUserId)
  const routines = useAppSelector(selectList) || []
  const types = useAppSelector(selectRoutineTypes)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!userId) return
    dispatch(getAllRoutinesAction())
    dispatch(getAllRoutineTypesAction())
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
  }, [dispatch, userId])

  const next = useMemo(() => suggestNextType(types, routines), [types, routines])

  const cards: { key: string; label: string; value: string; previous: string }[] = stats
    ? [
        { key: "workouts", label: t("home.workouts"), value: `${stats.current.workouts}`, previous: `${stats.previous.workouts}` },
        { key: "sets", label: t("home.sets"), value: `${stats.current.sets}`, previous: `${stats.previous.sets}` },
        { key: "volume", label: t("home.volume"), value: `${tonnes(stats.current.volume)} t`, previous: `${tonnes(stats.previous.volume)} t` }
      ]
    : []

  const describe = (item: { exercises: number; sets: number }) =>
    `${t("plan.exercises", { count: item.exercises })} · ${t("plan.sets", { count: item.sets })}`

  return (
    <Page headerComponent={<Header><Logo /></Header>}>
      <Root>
        {next && (
          <NextCard>
            <div>
              <small>{t("home.nextUp")}</small>
              <strong>{next.name}</strong>
            </div>
            <Start type="button" onClick={() => navigate("/routines/new")}>
              {t("home.start")}
            </Start>
          </NextCard>
        )}

        {stats && (
          <>
            <Heading>{t("home.thisMonth")}</Heading>
            <Grid>
              {cards.map(card => (
                <Card key={card.key}>
                  <strong>{card.value}</strong>
                  <span>{card.label}</span>
                  <small>{t("home.lastMonth", { value: card.previous })}</small>
                </Card>
              ))}
            </Grid>

            {stats.last && (
              <>
                <Heading>{t("home.lastWorkout")}</Heading>
                <Row type="button" onClick={() => navigate(`/routines/${stats.last?.id}`)}>
                  <span className="text">
                    <span className="title">{stats.last.type}</span>
                    <span className="meta">{describe(stats.last)}</span>
                  </span>
                  <span className="when">{relativeDay(stats.last.date, i18n.language)}</span>
                </Row>
              </>
            )}
          </>
        )}

        <Heading>{t("home.calendar")}</Heading>
        <RoutinesCalendar routines={routines} />

        {stats && stats.recent.length > 0 && (
          <>
            <Heading>{t("home.recent")}</Heading>
            <List>
              {stats.recent.map(item => (
                <Row key={item.id} type="button" onClick={() => navigate(`/routines/${item.id}`)}>
                  <span className="text">
                    <span className="title">{item.type}</span>
                    <span className="meta">{describe(item)}</span>
                  </span>
                  <span className="when">{new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "short" }).format(new Date(item.date))}</span>
                </Row>
              ))}
            </List>
          </>
        )}
      </Root>
    </Page>
  )
}

export default Home

const Header = styled.div`
  padding: 1rem;
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem 1.5rem;
`

const Heading = styled.h3`
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
`

const NextCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--radius-card);
  background: var(--surface);

  div {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  small {
    font-size: 0.7rem;
    color: var(--text-3);
  }

  strong {
    font-size: 1.1rem;
    color: var(--text-1);
  }
`

const Start = styled.button`
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: var(--radius-control);
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  cursor: pointer;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  background: var(--surface);

  strong {
    font-size: 1.4rem;
    color: var(--text-1);
    font-variant-numeric: tabular-nums;
  }

  span {
    font-size: 0.75rem;
    color: var(--text-2);
  }

  small {
    font-size: 0.65rem;
    color: var(--text-3);
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const Row = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
  background: var(--surface);
  text-align: left;
  cursor: pointer;

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .title {
    font-size: 0.9rem;
    color: var(--text-1);
  }

  .meta,
  .when {
    font-size: 0.7rem;
    color: var(--text-3);
  }

  .when {
    flex-shrink: 0;
  }
`
