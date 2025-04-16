"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
export interface User {
  id: string
  name: string
  email: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  // Login function - in a real app this would call an API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get stored users
      const usersJson = localStorage.getItem("users") || "[]"
      const users = JSON.parse(usersJson)

      // Find user with matching email and password
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        return false
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser

      // Store user in state and localStorage
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Signup function - in a real app this would call an API
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get stored users
      const usersJson = localStorage.getItem("users") || "[]"
      const users = JSON.parse(usersJson)

      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        return false
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // In a real app, this would be hashed
      }

      // Add to users array
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Create user object without password
      const { password: _, ...userWithoutPassword } = newUser

      // Store user in state and localStorage
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <UserContext.Provider value={{ user, loading, login, signup, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
