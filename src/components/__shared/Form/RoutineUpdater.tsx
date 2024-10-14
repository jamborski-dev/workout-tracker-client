import { FC } from "react"
import styled from "styled-components"
import Select from "react-select"

const movementsList = [
  { value: "1", label: "Bench Press", muscles: "Chest, Triceps" },
  { value: "2", label: "Deadlift", muscles: "Back, Hamstrings" },
  { value: "3", label: "Back Squat", muscles: "Quadriceps, Glutes" },
  { value: "4", label: "Overhead Press", muscles: "Shoulders, Triceps" },
  { value: "5", label: "Pull-Up", muscles: "Back, Biceps" },
  { value: "6", label: "Dumbbell Curl", muscles: "Biceps" },
  { value: "7", label: "Tricep Dip", muscles: "Triceps, Chest" },
  { value: "8", label: "Leg Press", muscles: "Quadriceps, Glutes" },
  { value: "9", label: "Lateral Raise", muscles: "Shoulders" },
  { value: "10", label: "Hamstring Curl", muscles: "Hamstrings" },
  { value: "11", label: "Calf Raise", muscles: "Calves" },
  { value: "12", label: "Chest Fly", muscles: "Chest" },
  { value: "13", label: "Lat Pulldown", muscles: "Back, Biceps" }
]

// Custom Option Component
const CustomOption = props => {
  const { data, innerRef, innerProps, isFocused } = props

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        alignItems: "center",
        backgroundColor: isFocused ? "#e6f7ff" : "transparent", // Blue highlight on hover
        color: isFocused ? "#333" : "#616161" // Adjust color to maintain readability
      }}
    >
      <span>{data.label}</span>
      <span style={{ fontSize: "0.9rem", color: "#888" }}>{data.muscles}</span>
    </div>
  )
}

// Custom Select Styles
const customStyles = {
  control: provided => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    padding: 0,
    minHeight: "unset",
    display: "inline-flex",
    alignItems: "center",
    width: "auto"
  }),
  valueContainer: provided => ({
    ...provided,
    padding: 0,
    display: "grid",
    alignItems: "center"
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

export const RoutineUpdater = () => {
  return (
    <Root>
      <Section count={1} />
      <Section count={2} isExpanded />
      <Section count={3} />
      <footer>
        <button>
          <span>+</span>
        </button>
      </footer>
    </Root>
  )
}

const Section: FC<{ count: number; isExpanded?: boolean }> = ({ count, isExpanded }) => {
  // [ ] introduce state
  // [ ] section for setting reps and weight as a accordion or a view (animation later with framer motion or similar)

  return (
    <>
      <section className={isExpanded ? "highlighted" : ""}>
        <aside>
          <div>
            <span>{count}</span>
          </div>
        </aside>
        {!isExpanded && (
          <>
            <header>
              <h2>Bench Press</h2>
              <span>3x8 @30kg</span>
            </header>
            <div>
              <div className="predefined-sets">
                <button className="selected">5x5</button>
                <button>4x12</button>
                <button>4x8</button>
                <button>Other</button>
              </div>
              <div className="predefined-weight">
                <button className="selected">55kg</button>
                <button>60kg</button>
                <button>70kg</button>
                <button>Other</button>
              </div>
            </div>
          </>
        )}
        {isExpanded && (
          <div className="set-rep-setting">
            <header>
              <Select
                styles={customStyles}
                // className="basic-single"
                // classNamePrefix="select"
                defaultValue={movementsList[0]}
                isSearchable
                name="movement"
                options={movementsList}
                components={{ Option: CustomOption }}
              />
              <span>3x8 @30kg</span>
            </header>
            <ul>
              <li>
                <span></span>
                <span>Reps</span>
                <span>Weight</span>
                <span></span>
              </li>
              <li>
                <span className="set-label">Set 1</span>
                <input type="number" />
                {/* prettier-ignore */}
                <div  className="weight-input"><input type="number" /><span>kg</span></div>
                <button>Remove</button>
              </li>
              <li>
                <span className="set-label">Set 2</span>
                <input type="number" />
                {/* prettier-ignore */}
                <div className="weight-input"><input type="number" /><span>kg</span></div>
                <button>Remove</button>
              </li>
              <li>
                <span className="set-label">Set 3</span>
                <input type="number" />
                {/* prettier-ignore */}
                <div className="weight-input"><input type="number" /><span>kg</span></div>
                <button>Remove</button>
              </li>
            </ul>
            <button className="add-set">+ Add Set</button>
          </div>
        )}
      </section>
    </>
  )
}

const Root = styled.div`
  section {
    padding-block: 1rem;
    padding-inline: 0.5rem;
    border-top: 1px solid #f1f1f1;

    display: grid;
    grid-template-columns: min-content auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "block_aside block_header"
      "block_aside block_content";

    &.highlighted {
      border-left: 7px solid #19a59a;
    }

    header {
      span {
        font-size: 0.85rem;
        color: #191919;
      }
    }

    h2 {
      font-size: 1.4rem;
      margin: 0;
      font-weight: 400;
      color: #616161;
    }

    aside {
      grid-area: block_aside;
      aspect-ratio: 1;
      padding: 1rem;
      display: grid;
      padding-top: 0.4rem;

      div {
        background: none;
        border: 1px solid #b5b5b5;
        border-radius: 1000px;
        width: 1.4rem;
        height: 1.4rem;
        position: relative;

        span {
          position: absolute;
          font-size: 0.6rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #656565;
        }
      }
    }

    &:first-child {
      border-top: 1px solid #ccc;
    }
  }

  select {
    background: #aaaaaa;
    padding: 0.4rem 1rem;
    border-radius: 100px;
    color: white;
    border: 0;

    &:hover {
      background: #999999;
    }
  }

  .predefined-sets,
  .predefined-weight {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;

    button {
      background: #e9e9e9;
      padding: 0.4rem 1rem;
      border-radius: 10rem;
      color: #434343;
      border: 0;

      &.selected {
        background: #2789ec;
        color: white;
        font-weight: 600;

        // todo make it a combined single choice button
        &:hover {
          background: #1f6abf;
        }
      }

      &:hover {
        background: #dbe6f1;
      }
    }
  }

  .predefined-weight button {
    &:hover {
      background: #ecd999;
    }
    &.selected {
      background: #ad8400;
    }
  }

  .set-rep-setting {
    font-size: 0.8rem;
    padding-right: 1rem;
    display: flex;
    flex-direction: column;
    border-top: 0;

    header {
      display: flex;
      flex-direction: column;
    }

    ul {
      padding-inline: 0;
      list-style: none;
      display: grid;
      gap: 0.5rem;

      li {
        display: grid;
        grid-template-columns: 32px repeat(2, 60px) 50px;
        align-items: center;
        gap: 0.5rem;
        margin-left: calc((32px + 0.5rem) * -1);

        span {
          font-size: 0.6rem;
        }

        .set-label {
          text-align: right;
          color: #818181;
        }

        button {
          background: none;
          border: none;
          color: #e99292;
          cursor: pointer;

          &:hover {
            color: #a60505;
          }
        }
      }
    }

    .checkbox-group {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    input {
      padding: 0.35rem 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid #c9c9c9;

      &:hover {
        border-color: #399fff;
      }

      /* Hide the spinner in Chrome, Safari, Edge, and Opera */
      &[type="number"]::-webkit-outer-spin-button,
      &[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Hide the spinner in Firefox */
      &[type="number"] {
        -moz-appearance: textfield;
      }
    }

    .weight-input {
      width: 60px;
      position: relative;

      input {
        width: 100%;
        background-color: transparent;
        z-index: 1;
      }

      span {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.7rem;
        color: #949494;
        z-index: 0;
        user-select: none;
      }
    }

    .add-set {
      background: none;
      border: none;
      color: #4391f1;
      cursor: pointer;
      width: max-content;

      &:hover {
        color: #0558a6;
      }
    }
  }
`
