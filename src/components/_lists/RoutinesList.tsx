import { SectionHeading } from "@components/SectionHeading/SectionHeading"
import { Table } from "@components/Table/Table"
import { Routine } from "@root/types/data"
import { FixMeLater } from "@root/types/FixMeLater"
import { formatDate } from "@root/utils/date"
import { useAppDispatch, useAppSelector } from "@store/hooks/store"
import { setRightPanel } from "@store/slices/page/page.slice"
import { selectRoutinesLoading } from "@store/slices/routines/routines.selectors"
import { deleteRoutineAction, getAllRoutinesAction } from "@store/slices/routines/routines.thunks"
import { selectUserId } from "@store/slices/users/users.selectors"
import { FC, useEffect } from "react"
import { FaTrash } from "react-icons/fa6"
import { MdModeEdit } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

export const RoutinesList = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const userId = useAppSelector(selectUserId)
  const routines: FixMeLater[] = []
  const isLoading = useAppSelector(selectRoutinesLoading)

  useEffect(() => {
    if (!userId) return

    dispatch(getAllRoutinesAction({ userId }))
  }, [dispatch, userId])

  const renderDate = (timestamp: string) => {
    const { day, month, getOrdinalSuffix } = formatDate(timestamp)
    return (
      <>
        {day}
        <sup>{getOrdinalSuffix}</sup> {month}
      </>
    )
  }

  const hanldeRowClick = (id: string | number) => {
    navigate(`/routines/${id}`)
  }

  return (
    <>
      <SectionHeading loading={isLoading} title={"Routines List"} />
      {routines.length === 0 ? (
        <p>No previous routines. Start new first.</p>
      ) : (
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
            onRowClick: (id: string | number) => hanldeRowClick(id),
            data: routines
          }}
        />
      )}
    </>
  )
}

interface RoutinesActionsProps {
  routine: Routine
}

const RoutineActions: FC<RoutinesActionsProps> = () => {
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    dispatch(deleteRoutineAction("routine.id"))
  }

  const handleEdit = () => {
    dispatch(setRightPanel({ view: "routineForm", title: "Edit Routines" }))
  }

  return (
    <>
      <InlineButton onClick={handleEdit}>
        <MdModeEdit />
      </InlineButton>
      <InlineButton onClick={handleDelete}>
        <FaTrash />
      </InlineButton>
    </>
  )
}

const InlineButton = styled.button`
  background: none;
  border: none;
  color: #b4b4b4;
  cursor: pointer;
  background: none;
  padding: 0.2rem;
  margin: 0;

  &:hover {
    color: #ffffff;
  }
`
