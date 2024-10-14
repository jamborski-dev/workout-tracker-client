import { AxiosError, AxiosResponse } from "axios"
import { API } from "@root/services/axios"
// import { getUserIdFromStore } from "./store"

type HTTPMethod = "get" | "post" | "put" | "delete" | "patch"

export const serviceCall = async <Params extends Record<string, unknown> | undefined, Returned>(
  params: Params,
  method: HTTPMethod,
  path: string,
  errorMessage: string,
  debug = false
): Promise<Returned> => {
  try {
    if (debug) {
      console.log(`Debug log: ${method} | ${path}`)
    }

    const response: AxiosResponse = await API[method](path, params)

    if (debug) {
      console.log(`Response: `, response)
    }
    return response.data
  } catch (error: unknown) {
    if (debug) {
      console.error(error)
    }

    // Handling Axios-specific errors
    if (error instanceof AxiosError) {
      if (error.response) {
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
  routineId: string
  movementId: string
  setId: string
}

type EndpointParams = { userId: string } & Partial<Segments>

// Utility to enforce required nesting
export const buildUserEndpointPath = ({ userId, routineId, movementId, setId }: EndpointParams) => {
  // Validate the hierarchy of parameters
  if (setId && !movementId) {
    throw new Error("setId requires movementId")
  }
  if (movementId && !routineId) {
    throw new Error("movementId requires routineId")
  }

  // Build the path
  let path = `/users/${userId}`
  if (routineId) path += `/routines/${routineId}`
  if (movementId) path += `/movements/${movementId}`
  if (setId) path += `/sets/${setId}`

  return path
}
