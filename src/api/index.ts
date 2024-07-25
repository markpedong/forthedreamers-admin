import { post } from '@/api/http'

// /public/login
export type TLoginDetails = {
	data: { token: string; refresh_token: string }
}

export const login = params => post<TLoginDetails>('/public/login', params)
