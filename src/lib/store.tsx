import { useCallback, useEffect, useMemo, useState, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import {
  adminStats as seedAdmin,
  myProjects as seedProjects,
  registryTokens as seedRegistry,
  rewardHistory as seedHistory,
  type TokenProject,
} from '../data/mock'

const STORAGE_KEY = 'decimal-tokenization-v1'

export type RewardChange = {
  date: string
  from: number
  to: number
  admin: string
}

export type AppState = {
  projects: TokenProject[]
  registry: TokenProject[]
  marketingPercent: number
  rewardHistory: RewardChange[]
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    /* ignore */
  }
  return {
    projects: seedProjects,
    registry: seedRegistry,
    marketingPercent: seedAdmin.marketingPercent,
    rewardHistory: seedHistory,
  }
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

type StoreApi = AppState & {
  registerProject: (project: TokenProject) => void
  setMarketingPercent: (next: number, admin?: string) => void
  findToken: (symbol: string) => TokenProject | undefined
  myIncome: number
}

const StoreContext = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() =>
    typeof window === 'undefined'
      ? {
          projects: seedProjects,
          registry: seedRegistry,
          marketingPercent: seedAdmin.marketingPercent,
          rewardHistory: seedHistory,
        }
      : loadState(),
  )

  useEffect(() => {
    saveState(state)
  }, [state])

  const registerProject = useCallback((project: TokenProject) => {
    setState((prev) => {
      const without = prev.registry.filter(
        (t) => t.symbol.toUpperCase() !== project.symbol.toUpperCase(),
      )
      const projectsWithout = prev.projects.filter(
        (t) => t.symbol.toUpperCase() !== project.symbol.toUpperCase(),
      )
      return {
        ...prev,
        registry: [project, ...without],
        projects: [project, ...projectsWithout],
      }
    })
  }, [])

  const setMarketingPercent = useCallback((next: number, admin = 'Admin') => {
    setState((prev) => ({
      ...prev,
      marketingPercent: next,
      rewardHistory: [
        {
          date: new Date().toLocaleDateString('ru-RU'),
          from: prev.marketingPercent,
          to: next,
          admin,
        },
        ...prev.rewardHistory,
      ],
    }))
  }, [])

  const findToken = useCallback(
    (symbol: string) => {
      const upper = symbol.toUpperCase()
      return (
        state.registry.find((t) => t.symbol === upper) ||
        state.projects.find((t) => t.symbol === upper)
      )
    },
    [state.projects, state.registry],
  )

  const myIncome = useMemo(
    () => state.projects.reduce((sum, p) => sum + (p.myReward || 0), 0),
    [state.projects],
  )

  const value: StoreApi = {
    ...state,
    registerProject,
    setMarketingPercent,
    findToken,
    myIncome,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}
