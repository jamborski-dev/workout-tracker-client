import axios from "axios"
import i18n from "@root/i18n"

// const serverUrl = import.meta.env.VITE_SERVER_URL

// if (!serverUrl) {
//   throw new Error("SERVER_URL is not set")
// }

// Create an instance of Axios with default configuration
export const API = axios.create({
  // baseURL: `${serverUrl}/api`,
  baseURL: `/api`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
})

// The server localises library content (exercise names) from the user's language
API.interceptors.request.use(config => {
  config.headers.set("Accept-Language", i18n.language)
  return config
})
