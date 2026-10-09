import type { Exercise } from "@root/types/data"
import type { StylesConfig } from "react-select"

const baseConfig = {
  control: (provided: object) => ({
    ...(provided as object),
    position: "relative",
    zIndex: "var(--layer-select-control)",
    border: "none",
    boxShadow: "none",
    padding: 0,
    minHeight: "unset",
    display: "inline-flex",
    alignItems: "center",
    width: "100%",
    paddingRight: "0.6rem",
    backgroundColor: "transparent"
  }),
  option: (provided: object, state: { isFocused: boolean }) => ({
    ...(provided as object),
    backgroundColor: state.isFocused ? "var(--accent-soft)" : "transparent",
    color: state.isFocused ? "var(--text-1)" : "var(--text-2)",
    cursor: "pointer",
    fontSize: "0.8rem"
  }),
  valueContainer: (provided: object) => ({
    ...(provided as object),
    padding: 0,
    display: "grid",
    alignItems: "center"
  }),
  placeholder: (provided: object) => ({
    ...(provided as object),
    fontSize: "1.4rem",
    fontWeight: 400,
    color: "var(--text-2)",
    margin: 0,
    gridArea: "1 / 1 / 2 / 2"
  }),
  singleValue: (provided: object) => ({
    ...(provided as object),
    fontSize: "1.4rem",
    fontWeight: 400,
    color: "var(--text-2)",
    margin: 0,
    gridArea: "1 / 1 / 2 / 2"
  }),
  input: (provided: object) => ({
    ...(provided as object),
    fontSize: "1.4rem",
    fontWeight: 400,
    color: "var(--text-2)",
    margin: 0,
    padding: 0,
    gridArea: "1 / 1 / 2 / 2"
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  dropdownIndicator: (provided: object) => ({
    ...(provided as object),
    padding: "0 0 0 0.5rem",
    alignSelf: "center"
  }),
  menu: (provided: object) => ({
    ...(provided as object),
    zIndex: "var(--layer-select-menu)",
    width: "min(480px, calc(100vw - 4rem))",
    minWidth: "min(360px, calc(100vw - 4rem))",
    maxWidth: "calc(100vw - 4rem)",
    boxSizing: "border-box",
    fontSize: "1rem",
    background: "var(--glass-sheet)",
    backdropFilter: "var(--glass-blur)",
    border: "1px solid var(--border-default)",
    borderRadius: "8px",
    boxShadow: "var(--shadow-lg)",
    overflow: "hidden"
  }),
  menuList: (provided: object) => ({
    ...(provided as object),
    paddingBlock: "0.25rem"
  }),
  menuPortal: (provided: object) => ({
    ...(provided as object),
    zIndex: "var(--layer-select-menu)"
  })
}

export const baseSelectStyles: StylesConfig<Record<string, unknown>> = baseConfig as StylesConfig<
  Record<string, unknown>
>

export const exerciseSelectStyles: StylesConfig<Exercise> = {
  ...(baseConfig as StylesConfig<Exercise>),
  option: provided => ({
    ...provided
  })
}
