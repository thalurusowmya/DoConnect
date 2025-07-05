"use client"

import { createContext, useContext, useEffect, useState } from "react"
import io from "socket.io-client"
import { API_URL } from "../config"

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Extract the base URL from API_URL
    const baseUrl = API_URL.split("/api")[0]

    // Create socket connection
    const socketInstance = io(baseUrl, {
      withCredentials: true,
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id)
      setConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const value = {
    socket,
    connected,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
