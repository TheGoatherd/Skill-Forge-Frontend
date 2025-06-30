import { getAuthToken, removeAuthToken } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApiError } from "./api-error"

const API_BASE_URL = "https://skill-forge-b-ackend.vercel.app"

export async function protectedFetch(url: string, options?: RequestInit) {
  const token = getAuthToken()
  if (!token) {
    redirect("/auth/login")
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      removeAuthToken()
      redirect("/auth/login")
    }

    if (!response.ok) {
      let genericMessage = "An unknown API error occurred."
      if (response.status >= 400 && response.status < 500) {
        genericMessage = "Bad Request"
      } else if (response.status >= 500 && response.status < 600) {
        genericMessage = "Server Error"
      }
      // Do NOT parse response.json() here to avoid leaking backend messages
      throw new ApiError(genericMessage, response.status)
    }

    return response.json()
  } catch (err: any) {
    // Handle network errors (e.g., server unreachable, no internet connection)
    if (err instanceof ApiError) {
      // If it's already our custom ApiError, re-throw it
      throw err
    } else if (err instanceof TypeError && err.message === "Failed to fetch") {
      // Specific check for network errors that manifest as "Failed to fetch"
      throw new ApiError("Failed to connect to server. Please check your internet connection.", 0) // Use 0 for network error
    } else {
      // Catch any other unexpected errors during the fetch process
      throw new ApiError("An unexpected error occurred during the request.", -1) // Use -1 for other unexpected fetch errors
    }
  }
}
