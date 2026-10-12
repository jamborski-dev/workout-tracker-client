import { SectionHeading } from "@components/SectionHeading/SectionHeading"
import { Table } from "@components/Table/Table"
import type { Routine } from "@root/types/data"
import { formatDate } from "@root/utils/date"
import { useAppDispatch } from "@store/hooks/store"
import { deleteRoutineAction } from "@store/slices/routines/routines.thunks"
import type { FC, SyntheticEvent } from "react"
import { FaTrash } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { Text } from "../__shared/Typography"
import { IconButton } from "../__shared/Button"
import { useTranslation } from "react-i18next"

interface RoutinesListProps {
  isLoading?: boolean
  routines: Routine[]
}

export const RoutinesList: FC<RoutinesListProps> = ({ routines, isLoading }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const renderRoutineInfo = (routine: Routine) => {
    const { weekday, day, month, getOrdinalSuffix } = formatDate(routine.date)
    const routineTypeLabel =
      typeof routine.routineType === "string" ? routine.routineType : routine.routineType?.name
    const titleLabel = routineTypeLabel || t("routines.uncategorized")

    return (
      <RoutineInfo>
        <DateText>
          {weekday}, {day}
          <sup>{getOrdinalSuffix}</sup> {month}
        </DateText>
        <RoutineTitle>{titleLabel}</RoutineTitle>
      </RoutineInfo>
    )
  }

  const handleRowClick = (id: string | number) => {
    navigate(`/routines/${id}`)
  }

  if (isLoading) {
    return (
      <Root>
        <SectionHeading loading={isLoading} title={t("routines.list")} />

        <Text>{t("routines.loading")}</Text>
      </Root>
    )
  }

  if (!routines.length) {
    return (
      <Root>
        <SectionHeading loading={isLoading} title={t("routines.list")} />

        <Text>{t("routines.empty")}</Text>
      </Root>
    )
  }

  return (
    <Root>
      <SectionHeading loading={isLoading} title={t("routines.list")} />
      <Table
        config={{
          columns: [
            {
              name: t("routines.colRoutine"),
              accessor: "custom",
              render: (routine: Routine) => renderRoutineInfo(routine)
            },
            {
              name: t("routines.colActions"),
              accessor: "custom",
              render: (routine: Routine) => <RoutineActions routine={routine} />
            }
          ],
          onRowClick: (id: string | number) => handleRowClick(id),
          data: routines
        }}
      />
    </Root>
  )
}

interface RoutinesActionsProps {
  routine: Routine
}

const RoutineActions: FC<RoutinesActionsProps> = ({ routine }) => {
  const dispatch = useAppDispatch()

  const handleDelete = (event: SyntheticEvent) => {
    event.stopPropagation()

    dispatch(deleteRoutineAction({ routineId: routine.id }))
  }

  return (
    <RoutineActionsRoot>
      <IconButton onClick={handleDelete} $size="sm">
        <FaTrash />
      </IconButton>
    </RoutineActionsRoot>
  )
}

const Root = styled.div`
  padding: 2rem;
`

const RoutineActionsRoot = styled.div`
  display: flex;
  justify-content: end;
  gap: 0.5rem;
`

const DateText = styled.span`
  font-size: 0.8rem;
  color: var(--text-2);
`

const RoutineInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`

const RoutineTitle = styled.span`
  font-size: 1rem;
  color: var(--text-2);
`
