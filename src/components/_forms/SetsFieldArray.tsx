import { useFieldArray, useFormContext } from "react-hook-form"
import { InputGroup, InputRow } from "@root/components/__shared/Form/Form"
import styled from "styled-components"

interface SetsFieldArrayProps {
  movementIndex: number
}

const SetsFieldArray = ({ movementIndex }: SetsFieldArrayProps) => {
  const { control, register } = useFormContext() // Get the form context
  const {
    fields: sets,
    append: appendSet,
    remove: removeSet
  } = useFieldArray({
    control,
    name: `movements.${movementIndex}.sets` // Dynamic name for the sets based on movement index
  })

  return (
    <SetsContainer>
      {sets.map((set, setIndex) => (
        <SetRow key={set.id}>
          <InputGroup>
            <label htmlFor={`movements[${movementIndex}].sets[${setIndex}].plannedReps`}>
              Reps
            </label>
            <RepsInput
              type="number"
              id={`movements[${movementIndex}].sets[${setIndex}].plannedReps`}
              {...register(`movements.${movementIndex}.sets.${setIndex}.plannedReps`)}
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor={`movements[${movementIndex}].sets[${setIndex}].plannedWeight`}>
              Weight
            </label>
            <WeightInput
              type="number"
              id={`movements[${movementIndex}].sets[${setIndex}].plannedWeight`}
              {...register(`movements.${movementIndex}.sets.${setIndex}.plannedWeight`)}
            />
          </InputGroup>

          <RemoveButton type="button" onClick={() => removeSet(setIndex)}>
            <span>-</span>
          </RemoveButton>
        </SetRow>
      ))}
      <AddButtonContainer>
        <AddButton type="button" onClick={() => appendSet({ plannedReps: 0, plannedWeight: 0 })}>
          <span>+</span>
        </AddButton>
      </AddButtonContainer>
    </SetsContainer>
  )
}

export default SetsFieldArray

const SetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SetRow = styled(InputRow)`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const RepsInput = styled.input`
  width: 4rem;
`

const WeightInput = styled.input`
  width: 4rem;
`

const AddButtonContainer = styled.div`
  border-bottom: 1px solid #ffffff27;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`

const AddButton = styled.button`
  background: #e49f15;
  border-radius: 200px;
  border: none;
  color: #000000;
  cursor: pointer;
  margin: 0;

  width: 1.2rem;
  height: 1.2rem;
  position: relative;
  transform: translateY(50%);

  & > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    color: #ffffff;
  }
`

const RemoveButton = styled(AddButton)`
  background: #ec3801;
`
