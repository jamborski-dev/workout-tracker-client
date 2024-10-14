import { useFieldArray, useFormContext } from "react-hook-form"
import { InputGroup } from "@root/components/__shared/Form/Form"
import SetsFieldArray from "./SetsFieldArray" // Import the sets component
import { ExerciseSelect } from "../__shared/Form/ExerciseSelect"

const MovementsFieldArray = () => {
  const { control, setValue } = useFormContext() // Get the form context from react-hook-form
  const {
    fields: movements,
    append: appendMovement,
    remove: removeMovement
  } = useFieldArray({
    control,
    name: "movements" // Top-level name for movements
  })

  return (
    <div>
      {movements.map((movement, movementIndex) => (
        <div key={movement.id}>
          <InputGroup>
            <label htmlFor={`movements[${movementIndex}].exerciseId`}>Exercise</label>
            <ExerciseSelect
              onChange={e => setValue(`movements.${movementIndex}.exerciseId`, e.target.value)} // Register selected value
              // defaultValue={ || ""}
            />
          </InputGroup>

          {/* Render the SetsFieldArray for each movement */}
          <SetsFieldArray movementIndex={movementIndex} />

          <button type="button" onClick={() => removeMovement(movementIndex)}>
            Remove Movement
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          appendMovement({ exerciseId: "", sets: [{ plannedReps: 0, plannedWeight: 0 }] })
        }
      >
        Add Movement
      </button>
    </div>
  )
}

export default MovementsFieldArray
