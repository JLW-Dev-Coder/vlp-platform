'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface AccountProviderProps {
  accountId: string | null
  children: React.ReactNode
  fallback?: React.ReactNode
}

export interface AccountContextValue<T> {
  data: T | null
  setData: (data: T) => void
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function createAccountContext<T>(
  fetcher: (accountId: string) => Promise<T>,
): {
  Provider: React.ComponentType<AccountProviderProps>
  useAccount: () => AccountContextValue<T>
  Context: React.Context<AccountContextValue<T> | null>
} {
  const Context = createContext<AccountContextValue<T> | null>(null)

  function Provider({ accountId, children, fallback }: AccountProviderProps) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)
    const [refetchCounter, setRefetchCounter] = useState<number>(0)

    useEffect(() => {
      if (!accountId) return
      let cancelled = false
      setLoading(true)
      setError(null)
      fetcher(accountId)
        .then((result) => {
          if (cancelled) return
          setData(result)
          setLoading(false)
        })
        .catch((err) => {
          if (cancelled) return
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        })
      return () => {
        cancelled = true
      }
    }, [accountId, refetchCounter])

    if (!accountId) {
      return <>{fallback ?? null}</>
    }

    if (loading && data === null) {
      return <>{fallback ?? null}</>
    }

    const value: AccountContextValue<T> = {
      data,
      setData,
      loading,
      error,
      refetch: () => setRefetchCounter((n) => n + 1),
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useAccount(): AccountContextValue<T> {
    const ctx = useContext(Context)
    if (ctx === null) {
      throw new Error('useAccount must be used within an AccountContext Provider')
    }
    return ctx
  }

  return { Provider, useAccount, Context }
}
