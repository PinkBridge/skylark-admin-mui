import { create } from 'zustand'

export interface MenuItem {
    title: string
    url: string
    icon: string
    isActive?: boolean
    items?: { title: string; url: string }[]
}

interface MenuStore {
  menuItems: MenuItem[]
  isLoading: boolean
  setMenuItems: (items: MenuItem[]) => void
  setLoading: (loading: boolean) => void
  toggleMenu: (id: string) => void
  clearMenu: () => void
}

export const useMenuStore = create<MenuStore>((set) => ({
  menuItems: [],
  isLoading: false,
  setMenuItems: (items) => set({ menuItems: items }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleMenu: (id) => set((state) => ({
    menuItems: state.menuItems.map(item => 
      item.id === id ? { ...item, isOpen: !item.isOpen } : item
    )
  })),
  clearMenu: () => set({ menuItems: [], isLoading: false })
}))