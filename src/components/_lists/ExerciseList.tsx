import { SectionHeading } from "@components/SectionHeading/SectionHeading"
import { Table } from "@components/Table/Table"
import {
  Exercise
  //  Routine
} from "@root/types/data"
// import { useAppDispatch } from "@store/hooks/store"
// import { deleteRoutineAction } from "@store/slices/routines/routines.thunks"
import { FC } from "react"
import { useAppDispatch } from "@store/hooks/store"
import {
  deleteExerciseAction,
  updateExerciseAction
} from "@root/store/slices/exercises/exercises.thunks"
// import { FaTrash } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { Text } from "../__shared/Typography"
// import { IconButton } from "../__shared/Button"

interface ExerciseListProps {
  isLoading?: boolean
  items: Exercise[]
}

export const ExerciseList: FC<ExerciseListProps> = ({ items, isLoading }) => {
  const navigate = useNavigate()

  const handleRowClick = (id: string | number) => {
    return
    navigate(`/exercises/${id}`)
  }

  const sectionHeadingProps = {
    loading: isLoading,
    title: "Exercise List"
  }

  if (isLoading) {
    return (
      <Root>
        <SectionHeading {...sectionHeadingProps} />

        <Text>Loading...</Text>
      </Root>
    )
  }

  if (!items.length) {
    return (
      <Root>
        <SectionHeading {...sectionHeadingProps} />

        <Text>No exercises. Create new first.</Text>
      </Root>
    )
  }

  return (
    <Root>
      <SectionHeading {...sectionHeadingProps} />
      <Table
        config={{
          columns: [
            {
              name: "Name",
              accessor: "name"
            },
            // {
            //   name: "Description",
            //   accessor: "description"
            // },
            {
              name: "Muscle Group",
              accessor: "muscleGroup"
            },
            {
              name: "Library",
              accessor: ["id", "name", "isBase", "isMine", "visibility", "reviewStatus", "reviewNote"],
              render: (exercise: Exercise) => <ExerciseStatus exercise={exercise} />
            }
            // {
            //   name: "Actions",
            //   accessor: "custom",
            //   render: (exercise: Exercise) => <RoutineActions exercise={exercise} />
            // }
          ],
          onRowClick: (id: string | number) => handleRowClick(id),
          data: items
        }}
      />
    </Root>
  )
}

const statusLabel = (exercise: Exercise) => {
  if (exercise.isBase) return "Base"
  if (exercise.visibility === "PUBLIC") return exercise.isMine ? "Public" : "Community"
  if (exercise.reviewStatus === "PENDING") return "Pending review"
  if (exercise.reviewStatus === "REJECTED") return "Private (declined)"
  return "Private"
}

// Status badge, plus actions for the user's own private exercises
const ExerciseStatus: FC<{ exercise: Exercise }> = ({ exercise }) => {
  const dispatch = useAppDispatch()
  const ownPrivate = exercise.isMine && exercise.visibility === "PRIVATE"
  const pending = exercise.reviewStatus === "PENDING"
  const exerciseId = exercise.id

  return (
    <StatusCell>
      <Badge $tone={pending ? "pending" : exercise.visibility === "PUBLIC" ? "public" : "private"}>
        {statusLabel(exercise)}
      </Badge>
      {exercise.reviewStatus === "REJECTED" && exercise.reviewNote && (
        <small>{exercise.reviewNote}</small>
      )}
      {ownPrivate && (
        <Actions>
          <button
            type="button"
            onClick={() =>
              dispatch(updateExerciseAction({ exerciseId, payload: { requestPublic: !pending } }))
            }
          >
            {pending ? "Withdraw" : "Request public"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${exercise.name}"?`)) {
                dispatch(deleteExerciseAction({ exerciseId }))
              }
            }}
          >
            Delete
          </button>
        </Actions>
      )}
    </StatusCell>
  )
}

const StatusCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;

  small {
    color: var(--color-text-muted, #888);
  }
`

const Badge = styled.span<{ $tone: "private" | "pending" | "public" }>`
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
  background: ${({ $tone }) =>
    $tone === "public" ? "#d9f2e6" : $tone === "pending" ? "#fdeccf" : "#e8e8ee"};
  color: #333;
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.75rem;
    color: var(--app-accent);
    cursor: pointer;
  }
`

const Root = styled.div`
  padding: 2rem;
`
