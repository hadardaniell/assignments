import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loadConfig, getConfig } from '../services/config.service'

const ConfigContext = createContext<any>(null)

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadConfig().then(() => setReady(true))
  }, [])

  if (!ready) return <div>Loading config...</div>

  return (
    <ConfigContext.Provider value={getConfig()}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)
