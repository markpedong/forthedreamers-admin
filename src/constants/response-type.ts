export type TLoginDetails = {
	token: string
	refresh_token: string
	userInfo: UserInfo
}

export type TCollectionItem = {
	id: string
	name: string
	images: string[]
	created_at: number
	updated_at: number
}

export type TUserItem = {
	id: string
	image: string
	first_name: string
	last_name: string
	phone: string
	address: string
	email: string
	username: string
	password: string
	created_at: number
	updated_at: number
}

export type TProductItem = {
	id: string
	images: string[]
	created_at: number
	updated_at: number
}

export type UserInfo = {
	id: string
	first_name: string
	last_name: string
	phone: string
	address: string
	email: string
	image: string
	username: string
	password: string
	created_at: number
	updated_at: number
}
