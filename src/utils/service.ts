import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { API } from "@root/services/axios"
import { IDType } from "@root/types/data"

type HTTPMethod = "get" | "post" | "put" | "delete" | "patch"
type Params<T = Record<string, unknown>> = T & AxiosRequestConfig<T>

export const secureServiceCall = async <T = Record<string, unknown>, Returned = undefined>({
  params,
  method,
  path,
  errorMessage,
  debug = false
}: {
  params?: Params<T>
  method: HTTPMethod
  path: string
  errorMessage: string
  debug?: boolean
}): Promise<Returned> => {
  try {
    let response: AxiosResponse<Returned>
    if (method === "get" || method === "delete") {
      response = await API[method](path, {
        params
      })
    } else {
      // POST, PUT, PATCH requests
      response = await API[method](path, params)
    }

    return response.data
  } catch (error: unknown) {
    // Handling Axios-specific errors
    if (error instanceof AxiosError) {
      if (error.response) {
        // Handle rate limiting (429) error
        if (error.response.status === 429 && typeof error.response.data === "string") {
          throw new Error(`${errorMessage}: ${error.response.data}`)
        }

        if (debug) {
          console.error(`Error status: ${error.response.status}`)
          console.error(`Error data:`, error.response.data)
        }

        // You can customize the error handling based on specific status codes
        if (error.response.data.error) {
          throw new Error(`${errorMessage}: ${error.response.data.error}`)
        }

        // Handle other status codes if needed
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error(`${errorMessage}: No response received from server`)
      } else {
        // Something happened in setting up the request
        throw new Error(`${errorMessage}: ${error.message}`)
      }
    }

    // Generic fallback for non-Axios errors
    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`)
    }

    throw new Error(errorMessage)
  }
}

type Segments = {
  routineId: IDType
  movementId: IDType
  setId: IDType
}

type EndpointParams = Partial<Segments>

// Utility to enforce required nesting
export const buildEndpointPath = ({ routineId, movementId, setId }: EndpointParams): string => {
  // Validate the hierarchy of parameters
  if (setId && !movementId) {
    throw new Error("setId requires movementId")
  }
  if (movementId && !routineId) {
    throw new Error("movementId requires routineId")
  }

  // Build the path
  let path = ``
  if (routineId) path += `/routines/${routineId}`
  if (movementId) path += `/movements/${movementId}`
  if (setId) path += `/sets/${setId}`

  return path
}
