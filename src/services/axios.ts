import axios from "axios"

const serverUrl = process.env.VITE_SERVER_URL

// Create an instance of Axios with default configuration
export const API = axios.create({
  baseURL: `${serverUrl}/api`, // Base URL for your API
  // baseURL: "http://192.168.1.60:5001/api", // Base URL for your API
  timeout: 10000, // Optional: Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json" // Default header for JSON
  }
})
