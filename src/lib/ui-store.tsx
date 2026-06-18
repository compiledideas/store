import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
  
} from 'react'
import type {ReactNode} from 'react';

interface UiContextValue {
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  mobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
}

const UiContext = createContext<UiContextValue | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const toggleCart = useCallback(() => setCartOpen((o) => !o), [])

  const value = useMemo<UiContextValue>(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      toggleCart,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [cartOpen, openCart, closeCart, toggleCart, mobileNavOpen],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used within a UiProvider')
  return ctx
}
