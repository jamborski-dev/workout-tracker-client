import { FixMeLater } from "@root/types/FixMeLater"
import { FC, Fragment } from "react"
import styled from "styled-components"

interface TableProps {
  config: {
    columns: Array<{
      name: string
      accessor: string | string[]
      render?: (value: FixMeLater, id?: string) => FixMeLater
    }>
    onRowClick?: (id: number | string) => void
    data: Record<string, FixMeLater>[]
  }
}

export const Table: FC<TableProps> = ({ config }) => {
  return (
    <TableRoot>
      <TableHead>
        <TableRow>
          {config.columns.map((column: FixMeLater, i: number) => {
            const { accessor, name } = column

            const isAccessorValid = Array.isArray(accessor)
              ? accessor.every(key => Object.keys(config.data[0]).includes(key))
              : Object.keys(config.data[0]).includes(accessor)

            return isAccessorValid ? <TableCell key={i}>{name}</TableCell> : null
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {config.data.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            <TableRow onClick={() => config.onRowClick?.(row.id)}>
              {config.columns.map((column: FixMeLater, i: number) => {
                const { accessor, render } = column

                // Handle array of accessors
                if (Array.isArray(accessor)) {
                  if (!render) {
                    throw new Error(
                      `Render function is required when passing multiple accessors: ${accessor}`
                    )
                  }
                  const values = accessor.reduce((acc, key) => {
                    acc[key] = row[key]
                    return acc
                  }, {})
                  return <TableCell key={i}>{render(values, row.id)}</TableCell>
                }

                // Handle single string accessor or custom case
                const cellContent =
                  accessor === "custom" && render
                    ? render(row)
                    : render
                    ? render(row[accessor], row.id)
                    : row[accessor]

                return cellContent !== undefined ? (
                  <TableCell key={i}>{cellContent}</TableCell>
                ) : null
              })}
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </TableRoot>
  )
}

export const TableRoot = styled.table`
  font-family: "PT Sans Narrow", sans-serif;

  width: 100%;
  border-collapse: collapse;
  overflow: scroll;
  background-color: #fff;
  color: rgb(124, 124, 124);
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.5em;

  thead {
    color: rgb(80, 80, 80);
    font-weight: 900;
  }

  td {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-right: 1em;
  }

  tr:not(:first-child) {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  td:first-child {
    padding-left: 1em;
    padding-right: 0;
  }

  tr:nth-child(odd):not(thead tr) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  tr:not(thead tr):hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .transaction-type--expense {
    color: rgb(199, 56, 20);
  }
  .transaction-type--income {
    color: rgb(131, 204, 13);
  }

  .transaction-sign {
    font-weight: 900;
  }

  .table-tools {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1em;
    margin-bottom: 1em;
  }
`
const TableHead = styled.thead``
const TableBody = styled.tbody``
const TableRow = styled.tr``
const TableCell = styled.td``
