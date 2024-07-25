import { post, upload } from '@/api/http'
import { TUploadImage } from '@/constants/types'

// /public/login
export type TLoginDetails = {
	data: { token: string; refresh_token: string }
}

export const login = params => post<TLoginDetails>('/public/login', params)

export const uploadImage = params => upload<TUploadImage>('/api/uploadImage', params)
