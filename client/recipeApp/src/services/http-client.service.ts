import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getConfig } from './config.service'

export type RequestData = Record<string, any> | undefined

class HttpClient {
  private client: AxiosInstance

  constructor() {
    const { apiBaseUrl } = getConfig()
    this.client = axios.create({
      baseURL: apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('HTTP Error:', error)
        return Promise.reject(error)
      }
    )
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    const res = await this.client.get<T>(url, config)
    return res.data
  }

  async post<T = any>(url: string, data?: RequestData, config?: AxiosRequestConfig) {
    const res = await this.client.post<T>(url, data, config)
    return res.data
  }

  async put<T = any>(url: string, data?: RequestData, config?: AxiosRequestConfig) {
    const res = await this.client.put<T>(url, data, config)
    return res.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    const res = await this.client.delete<T>(url, config)
    return res.data
  }
}

// singleton – משתמשים בכל האפליקציה
export const httpClient = new HttpClient()
