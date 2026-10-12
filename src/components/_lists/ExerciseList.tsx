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
import { useTranslation } from "react-i18next"
import i18n, { muscleLabel } from "@root/i18n"
// import { IconButton } from "../__shared/Button"

interface ExerciseListProps {
  isLoading?: boolean
  items: Exercise[]
}

export const ExerciseList: FC<ExerciseListProps> = ({ items, isLoading }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleRowClick = (id: string | number) => {
    return
    navigate(`/exercises/${id}`)
  }

  const sectionHeadingProps = {
    loading: isLoading,
    title: t("exercises.list")
  }

  if (isLoading) {
    return (
      <Root>
        <SectionHeading {...sectionHeadingProps} />

        <Text>{t("routines.loading")}</Text>
      </Root>
    )
  }

  if (!items.length) {
    return (
      <Root>
        <SectionHeading {...sectionHeadingProps} />

        <Text>{t("exercises.empty")}</Text>
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
              name: t("exercises.colName"),
              accessor: "name"
            },
            // {
            //   name: "Description",
            //   accessor: "description"
            // },
            {
              name: t("exercises.colMuscle"),
              accessor: "muscleGroup",
              render: (muscleGroup?: string | null) => <>{muscleLabel(muscleGroup)}</>
            },
            {
              name: t("exercises.colLibrary"),
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
  if (exercise.isBase) return i18n.t("exercises.base")
  if (exercise.visibility === "PUBLIC") return i18n.t(exercise.isMine ? "exercises.public" : "exercises.community")
  if (exercise.reviewStatus === "PENDING") return i18n.t("exercises.pending")
  if (exercise.reviewStatus === "REJECTED") return i18n.t("exercises.declined")
  return i18n.t("exercises.private")
}

// Status badge, plus actions for the user's own private exercises
const ExerciseStatus: FC<{ exercise: Exercise }> = ({ exercise }) => {
  const { t } = useTranslation()
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
            {pending ? t("exercises.withdraw") : t("exercises.requestPublic")}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t("exercises.confirmDelete", { name: exercise.name }))) {
                dispatch(deleteExerciseAction({ exerciseId }))
              }
            }}
          >
            {t("exercises.delete")}
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
    color: var(--text-3);
  }
`

const Badge = styled.span<{ $tone: "private" | "pending" | "public" }>`
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 3px;
  background: ${({ $tone }) =>
    $tone === "public"
      ? "color-mix(in srgb, var(--success) 18%, transparent)"
      : $tone === "pending"
        ? "color-mix(in srgb, var(--warning) 20%, transparent)"
        : "var(--pill-bg)"};
  color: ${({ $tone }) =>
    $tone === "public" ? "var(--success)" : $tone === "pending" ? "var(--warning)" : "var(--text-2)"};
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
