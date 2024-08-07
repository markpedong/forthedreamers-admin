import { get, post, upload } from '@/api/http'
import { TCollectionItem, TLoginDetails, TProductItem, TUserItem, TVariationItem, TWebsiteInfo } from '@/constants/types'
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

// /users/delete
export const deleteUser = params => post('/users/delete', params)

// /users/toggle
export const toggleUser = params => post('/users/toggle', params)

// /products/get
export const getProducts = params => post<TProductItem[]>('/products/get', params)

// /products/add
export const addProduct = params => post('/products/add', params)

// /products/update
export const updateProduct = params => post('/products/update', params)

// /products/toggle
export const toggleProducts = params => post('/products/toggle', params)

// /variations/get
export const getVariations = params => post<TVariationItem[]>('/variations/get', params)

// /variations/update
export const updateVariations = params => post('/variations/update', params)

// /variations/toggle
export const toggleVariations = params => post('/variations/toggle', params)

// /variations/delete
export const deleteVariations = params => post('/variations/delete', params)

// /variations/add
export const addVariations = params => post('/variations/add', params)

// /website/get
export const getWebsiteData = params => get<TWebsiteInfo>('/website/get', params)

// /website/update
export const updateWebsiteData = params => post<TWebsiteInfo>('/website/update', params)
