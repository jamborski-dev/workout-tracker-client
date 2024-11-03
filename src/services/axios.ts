import axios from "axios"

const serverUrl = import.meta.env.VITE_SERVER_URL

if (!serverUrl) {
  throw new Error("SERVER_URL is not set")
}

// Create an instance of Axios with default configuration
export const API = axios.create({
  baseURL: `${serverUrl}/api`, // Base URL for your API
  // baseURL: "http://192.168.1.60:5001/api", // Base URL for your API
  timeout: 60000, // 60s as Render cold start is about 50s
  headers: {
    "Content-Type": "application/json" // Default header for JSON
  }
})
