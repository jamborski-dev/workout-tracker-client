import { SectionHeading } from "@components/SectionHeading/SectionHeading"
import { Table } from "@components/Table/Table"
import { Routine } from "@root/types/data"
import { formatDate } from "@root/utils/date"
import { useAppDispatch } from "@store/hooks/store"
import { deleteRoutineAction } from "@store/slices/routines/routines.thunks"
import { FC, SyntheticEvent } from "react"
import { FaTrash } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { Text } from "../__shared/Typography"
import { IconButton } from "../__shared/Button"

interface RoutinesListProps {
  isLoading?: boolean
  routines: Routine[]
}

export const RoutinesList: FC<RoutinesListProps> = ({ routines, isLoading }) => {
  const navigate = useNavigate()

  const renderDate = (timestamp: string) => {
    const { day, month, getOrdinalSuffix } = formatDate(timestamp)
    return (
      <>
        {day}
        <sup>{getOrdinalSuffix}</sup> {month}
      </>
    )
  }

  const handleRowClick = (id: string | number) => {
    navigate(`/routines/${id}`)
  }

  if (isLoading) {
    return (
      <Root>
        <SectionHeading loading={isLoading} title={"Routines List"} />

        <Text>Loading...</Text>
      </Root>
    )
  }

  if (!routines.length) {
    return (
      <Root>
        <SectionHeading loading={isLoading} title={"Routines List"} />

        <Text>No previous routines. Start new first.</Text>
      </Root>
    )
  }

  return (
    <Root>
      <SectionHeading loading={isLoading} title={"Routines List"} />
      <Table
        config={{
          columns: [
            {
              name: "Date",
              accessor: "date",
              render: renderDate
            },
            {
              name: "Name",
              accessor: "name"
            },
            {
              name: "Actions",
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
    <>
      <IconButton onClick={handleDelete} $size="sm">
        <FaTrash />
      </IconButton>
    </>
  )
}

const Root = styled.div`
  padding: 2rem;
`
