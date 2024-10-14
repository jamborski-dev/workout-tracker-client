import axios from "axios"

// Create an instance of Axios with default configuration
export const API = axios.create({
  baseURL: "http://localhost:5001/api", // Base URL for your API
  timeout: 10000, // Optional: Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json" // Default header for JSON
  }
})
