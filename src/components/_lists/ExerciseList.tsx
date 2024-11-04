import { SectionHeading } from "@components/SectionHeading/SectionHeading"
import { Table } from "@components/Table/Table"
import {
  Exercise
  //  Routine
} from "@root/types/data"
// import { useAppDispatch } from "@store/hooks/store"
// import { deleteRoutineAction } from "@store/slices/routines/routines.thunks"
import {
  FC
  // SyntheticEvent
} from "react"
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
    navigate(`/items/${id}`)
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
            {
              name: "Description",
              accessor: "description"
            },
            {
              name: "Muscle Group",
              accessor: "muscleGroup"
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

// interface RoutinesActionsProps {
//   routine: Routine
// }

// TODO make this a generic component
// const RoutineActions: FC<RoutinesActionsProps> = ({ routine }) => {
//   const dispatch = useAppDispatch()

//   const handleDelete = (event: SyntheticEvent) => {
//     event.stopPropagation()

//     // dispatch(deleteRoutineAction({ routineId: routine.id }))
//   }

//   return (
//     <>
//       <IconButton onClick={handleDelete} $size="sm">
//         <FaTrash />
//       </IconButton>
//     </>
//   )
// }

const Root = styled.div`
  padding: 2rem;
`
