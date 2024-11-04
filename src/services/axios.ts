import axios from "axios"

const serverUrl = import.meta.env.VITE_SERVER_URL

if (!serverUrl) {
  throw new Error("SERVER_URL is not set")
}

// Create an instance of Axios with default configuration
export const API = axios.create({
  baseURL: `${serverUrl}/api`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
})
