import { message } from 'antd'
import axios, { AxiosInstance } from 'axios'
import { throttle } from 'lodash'
import { stringify } from 'qs'
import { getLocalStorage } from '@/utils/xLocalstorage'

export type ApiResponse<T = null> = {
  data: T & {
    message: string
    status: number
    success: boolean
  }
}

const throttleAlert = (msg: string) => throttle(message.error(msg), 1500, { trailing: false })

const instance: AxiosInstance = axios.create({ timeout: 60000, withCredentials: true })

instance.interceptors.response.use(response => {
  if (!response?.data.success) {
    throttleAlert(response?.data.message)
  }

  return response
})

instance.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

const upload = async <T>(url: string, data): Promise<ApiResponse<{ data: T }>> => {
  const token = getLocalStorage('token')
  const form = new FormData()

  form.append('file', data)

  //prettier-ignore
  const response = await instance.post(`${import.meta.env.VITE_DOMAIN}${url}`, form, {
		headers: {
			'Content-Type': 'multipart/form-data',
			"token": token,
      'Cookie': `Auth=${getLocalStorage('token')}`
		},
    withCredentials: true
	})

  return response
}

const post = async <T>(url: string, data = {}): Promise<ApiResponse<{ data: T }>> =>
  instance.post(`${import.meta.env.VITE_DOMAIN}${url}`, data, {
    headers: {
      'Content-Type': 'application/json',
      token: getLocalStorage('token'),
      'Cookie': `Auth=${getLocalStorage('token')}`
    },
    withCredentials: true
  })

const get = async <T>(url: string, data = {}): Promise<ApiResponse<{ data: T }>> =>
  instance.get(`${import.meta.env.VITE_DOMAIN}${url}${stringify(data) ? '?' + stringify(data) : ''}`, {
    headers: {
      token: getLocalStorage('token'),
      'Cookie': `Auth=${getLocalStorage('token')}`
    },
    withCredentials: true
  })

export { post, get, upload }
