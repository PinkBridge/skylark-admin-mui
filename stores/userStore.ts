
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MenuItem {
  title: string
  url: string
  icon: string | "User"
  isOpen?: boolean
  children?: MenuItem[]
  name: string
  type: string
  parentId: string
  id: string
  sort: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  component: string
  hidden: boolean
  cache: boolean
  alwaysShow: boolean
  path: string
  redirect: string
  level: number
  code: string
}

interface User {
  id: string
  username: string | "yaomianwei"
  email: string | "yaomianwei@gmail.com"
  role: string | "visitor"
  avatar: string | "https://github.com/shadcn.png"
  menus: MenuItem[]
}

interface UserStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  setAuthenticated: (authenticated: boolean) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)