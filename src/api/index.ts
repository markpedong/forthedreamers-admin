import { post, upload } from '@/api/http'
import { TCollectionItem, TLoginDetails, TProductItem, TUserItem } from '@/constants/response-type'
import { TUploadImage } from '@/constants/types'

// /public/login

export const login = params => post<TLoginDetails>('/public/login', params)

export const uploadImage = params => upload<TUploadImage>('/api/uploadImage', params)

// /collections/get
export const getCollections = params => post<TCollectionItem[]>('/collections/get', params)

// /collections/add
export const addCollection = params => post('/collections/add', params)

// /collections/update
export const updateCollection = params => post('/collections/update', params)

// /collections/update
export const deleteCollection = params => post('/collections/delete', params)

// /users/get
export const getUsers = params => post<TUserItem[]>('/users/get', params)

// /users/add
export const addUser = params => post('/users/add', params)

// /users/update
export const updateUser = params => post('/users/update', params)

// /products/get
export const getProducts = params => post<TProductItem[]>('/products/get', params)

// /products/add
export const addProduct = params => post('/products/add', params)

// /products/update
export const updateProduct = params => post('/products/update', params)
