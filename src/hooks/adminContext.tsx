'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface Admin {
  name: string
  role: string
}

interface AdminContextProps {
  admin: Admin | null
  setAdmin: (admin: Admin | null) => void
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin')
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin))
    }
  }, [])

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin deve ser usado dentro de AdminProvider')
  }
  return context
}
