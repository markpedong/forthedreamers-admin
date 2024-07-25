import { get, post, upload } from '@/api/http'
import type { GetProp, UploadProps } from 'antd'
import { GLOBAL_STATUS } from './constants'

// /public/login
export type TLoginDetails = {
	data: { token: string; refresh_token: string }
}

export const login = params => post<TLoginDetails>('/public/login', params)

// /info/addWebsiteDetails
export type TWebsiteItem = {
	id: string
	status: number
}
export const addWebsiteDetails = params => post('/info/addWebsiteDetails', params)

// /info/getWebsiteDetails
export const getWebsiteDetails = () => get<TWebsiteItem>('/info/getWebsiteDetails')

// /info/updateWebsiteDetails
export const updateWebsiteDetails = params => post('/info/updateWebsiteDetails', params)

//info/getDetails
export type TDetailsItem = {
	address: string
	created_at: number
	description: string
	email: string
	first_name: string
	id: string
	last_name: string
	phone: string
	isResumeDownloadable: number
	resume_pdf: string
	resume_docx: string
	updated_at: number
}

export const getDetails = () => get<TDetailsItem>('/info/getDetails')

// /info/addDetails
export const addDetails = params => post<TDetailsItem>('/info/addDetails', params)

// /info/updateDetails
export const updateDetails = params => post<TDetailsItem>('/info/updateDetails', params)

// /links/getLinks
export type TLinksItem = {
	created_at: number
	id: string
	link: string
	updated_at: number
	type: string
	status: GLOBAL_STATUS
}
export const getLinks = () => get<TLinksItem[]>('/links/getLinks')

// /links/addLinks
export const addLinks = params => post('/links/addLinks', params)

// /links/deleteLinks
export const updateLinks = params => post('/links/updateLinks', params)

// /links/deleteLinks
export const deleteLinks = params => post('/links/deleteLinks', params)

// /links/toggleLinkStatus
export const toggleLinkStatus = params => post('/links/toggleLinkStatus', params)

// /services/getServices
export type TServiceItem = {
	id: string
	title: string
	description: string
	logo: string
	status: GLOBAL_STATUS
	created_at: number
	updated_at: number
}
export const getServices = () => get<TServiceItem[]>('/services/getServices')

// /services/updateServices
export const updateServices = params => post('/services/updateServices', params)

// /services/addServices
export const addServices = params => post('/services/addServices', params)

// /services/deleteServices
export const deleteServices = params => post('/services/deleteServices', params)

// /services/toggleServiceStatus
export const toggleServiceStatus = params => post('/services/toggleServiceStatus', params)

// /api/uploadImage
export type TUploadImage = {
	url: string
	fileName: string
	size: number
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const uploadImage = params => upload<TUploadImage>('/api/uploadImage', params)

// /portfolios/addPortfolios
export const addPortfolios = params => post('/portfolios/addPortfolios', params)

// /portfolios/updatePortfolios
export const updatePortfolios = params => post('/portfolios/updatePortfolios', params)

// /portfolios/togglePortfolioStatus
export const togglePortfolioStatus = params => post('/portfolios/togglePortfolioStatus', params)

// /portfolios/deletePortfolios
export const deletePortfolios = params => post('/portfolios/deletePortfolios', params)

// /portfolios/getPortfolios
export type TPortfolioItem = {
	id: string
	title: string
	tech: string[]
	link: string
	image: string
	status: GLOBAL_STATUS
	created_at: number
	updated_at: number
}
export const getPortfolios = () => get<TPortfolioItem[]>('/portfolios/getPortfolios')

// /experiences/addExperiences
export const addExperiences = params => post('/experiences/addExperiences', params)

// /experiences/updateExperiences
export const updateExperiences = params => post('/experiences/updateExperiences', params)

// /experiences/deleteExperiences
export const deleteExperiences = params => post('/experiences/deleteExperiences', params)

// /experiences/getExperiences
export type TDescriptionItem = {
	id: string
	description: string
	experience_id: string
}

export type TExperienceItem = {
	id: string
	company: string
	title: string
	location: string
	started: string
	ended: string
	skills: { id: string; name: string; percentage: number }[]
	descriptions: TDescriptionItem[]
	status: GLOBAL_STATUS
	created_at: number
	updated_at: number
}

export const getExperiences = () => get<TPortfolioItem[]>('/experiences/getExperiences')

// /experiences/toggleExperienceStatus
export const toggleExperienceStatus = params => post('/experiences/toggleExperienceStatus', params)

// /blogs/getBlogs
export type TBlogsItem = {
	title: string
	date: string
	description: string
	link: string
	image: string
	id: string
	status: GLOBAL_STATUS
	created_at: number
	updated_at: number
}
export const getBlogs = () => get<TBlogsItem[]>('/blogs/getBlogs')

// /blogs/addBlogs
export const addBlogs = params => post('/blogs/addBlogs', params)

// /blogs/updateBlogs
export const updateBlogs = params => post('/blogs/updateBlogs', params)

// /blogs/deleteBlogs
export const deleteBlogs = params => post('/blogs/deleteBlogs', params)

// /blogs/toggleBlogStatus
export const toggleBlogStatus = params => post('/blogs/toggleBlogStatus', params)

// /messages/getMessages
export type TMessageItem = {
	id: string
	name: string
	email: string
	message: string
	created_at: number
	updated_at: number
}
export const getMessages = () => get<TMessageItem[]>('/messages/getMessages')

// /messages/addMessages
export const addMessages = params => post('/messages/addMessages', params)

// /testimonials/getTestimonials
export type TTestimonialsItem = {
	id: string
	author: string
	description: string
	image: string
	job: string
	status: GLOBAL_STATUS
	created_at: number
	updated_at: number
}
export const getTestimonials = () => get<TTestimonialsItem[]>('/testimonials/getTestimonials')

// /testimonials/addTestimonials
export const addTestimonials = params => post('/testimonials/addTestimonials', params)

// /testimonials/updateTestimonials
export const updateTestimonials = params => post('/testimonials/updateTestimonials', params)

// /testimonials/deleteTestimonials
export const deleteTestimonials = params => post('/testimonials/deleteTestimonials', params)

// /testimonials/toggleTestimonialStatus
export const toggleTestimonialStatus = params => post('/testimonials/toggleTestimonialStatus', params)

// /educations/getTestimonials
export type TEducationsItem = {
	id: string
	school: string
	course: string
	started: string
	ended: string
	description: string
	status: GLOBAL_STATUS
	skills: { id: string; name: string; percentage: number }[]
	created_at: number
	updated_at: number
}
export const getEducations = () => get<TEducationsItem[]>('/educations/getEducations')

// /educations/addEducations
export const addEducations = params => post('/educations/addEducations', params)

// /educations/updateEducations
export const updateEducations = params => post('/educations/updateEducations', params)

// /educations/deleteEducations
export const deleteEducations = params => post('/educations/deleteEducations', params)

// /educations/toggleEducationStatus
export const toggleEducationStatus = params => post('/educations/toggleEducationStatus', params)
