import { FC, Ref, useEffect } from "react"
import { OptionProps, SingleValue, StylesConfig } from "react-select"
import Select from "react-select"
import { Exercise, IDType } from "@root/types/data"
import { Controller, useFormContext } from "react-hook-form"
import { useAppSelector } from "@root/store/hooks/store"

const CustomOption: FC<OptionProps<Exercise>> = props => {
  const { data, innerRef, innerProps, isFocused } = props

  return (
    <div
      ref={innerRef as Ref<HTMLDivElement>}
      {...innerProps}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        alignItems: "center",
        lineHeight: "1.2",
        cursor: "pointer",
        backgroundColor: isFocused ? "#e6f7ff" : "transparent", // Blue highlight on hover
        color: isFocused ? "#333" : "#616161" // Adjust color to maintain readability
      }}
    >
      <span>{data.name}</span>
      <span style={{ fontSize: "0.9rem", color: "#888", textAlign: "right" }}>
        {data.muscleGroup}
      </span>
    </div>
  )
}

// Custom Select Styles
const customStyles: StylesConfig<Exercise> = {
  control: provided => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    padding: 0,
    minHeight: "unset",
    display: "inline-flex",
    alignItems: "center",
    width: "auto",
    paddingRight: "0.6rem"
  }),
  valueContainer: provided => ({
    ...provided,
    padding: 0,
    display: "grid",
    alignItems: "center"
  }),
  placeholder: provided => ({
    ...provided,
    fontSize: "1.4rem",
    fontWeight: 400,
    color: "#616161", // Match the placeholder color with the selected value color
    margin: 0,
    gridArea: "1 / 1 / 2 / 2"
  }),
  singleValue: provided => ({
    ...provided,
    fontSize: "1.4rem",
    fontWeight: 400,
    color: "#616161",
    margin: 0,
    gridArea: "1 / 1 / 2 / 2"
  }),
  input: provided => ({
    ...provided,
    fontSize: "1.4rem",
    fontWeight: 400,
    color: "#616161",
    margin: 0,
    padding: 0,
    gridArea: "1 / 1 / 2 / 2"
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: "0 0 0 0.5rem",
    alignSelf: "center"
  }),
  menu: provided => ({
    ...provided,
    maxWidth: "300px"
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#e6f7ff" : "transparent", // Default blue highlight
    color: state.isFocused ? "#333" : "#616161", // Maintain consistent text color
    cursor: "pointer",
    padding: "0.5rem 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  })
}

interface ExerciseSelectProps {
  movementId: IDType
  exerciseId?: IDType | null
  onChange: (selected: IDType) => void
}

export const ExerciseSelect: FC<ExerciseSelectProps> = ({ movementId, exerciseId, onChange }) => {
  const { control, setValue } = useFormContext() // Use useFormContext if you're inside a FormProvider
  const exerciseList = useAppSelector(state => state.exercises.list)
  const isLoading = useAppSelector(state => state.exercises.isLoading)
  const handleOnChange = (selected: SingleValue<Exercise>) => {
    if (!selected) return

    onChange(selected.id) // ID of the selected movement
  }

  const defaultValue = exerciseId
    ? exerciseList.find(exercise => exercise.id === exerciseId)
    : undefined

  useEffect(() => {
    if (exerciseId) {
      setValue(`movement.${movementId}.select`, exerciseId)
    }
  }, [exerciseId, setValue, movementId])

  return (
    <Controller
      name={`movement.${movementId}.select`}
      control={control}
      defaultValue={defaultValue}
      // defaultValue={exerciseId ? exerciseList.find(ex => ex.id === exerciseId) : null}
      render={({ field, fieldState: { error } }) => (
        <>
          <Select
            {...field}
            inputRef={field.ref}
            styles={customStyles}
            isLoading={isLoading}
            isSearchable
            placeholder="-"
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id.toString()}
            options={exerciseList}
            components={{ Option: CustomOption }}
            value={exerciseList.find(option => option.id === field.value)}
            // @ts-expect-error onChange type mismatch
            onChange={(selected: SingleValue<Exercise>) => {
              field.onChange((selected?.id ?? null) as SingleValue<Exercise>) // Update the form state
              handleOnChange((selected ?? null) as SingleValue<Exercise>) // Call the additional onChange callback
            }}
          />
          {error && <span style={{ color: "red" }}>{error.message}</span>}
        </>
      )}
    />
  )
}
