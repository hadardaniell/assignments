import type { AppConfig } from "../assets/types/config.types"

let config: AppConfig | null = null

export async function loadConfig() {
  if (config) return config

  const response = await fetch('/config.json')
  config = await response.json()

  return config
}

export function getConfig(): AppConfig {
  if (!config) {
    throw new Error('Config not loaded yet')
  }
  return config
}
