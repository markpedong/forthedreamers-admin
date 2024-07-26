import { message } from 'antd'
import { RcFile } from 'antd/lib/upload'
import numeral from 'numeral'

export const clearUserData = () => {
	const cookies = document.cookie.split(';')

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i]
		const eqPos = cookie.indexOf('=')
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
	}

	caches.keys().then(keys => {
		keys.forEach(key => caches.delete(key))
	})

	indexedDB.databases().then(dbs => {
		dbs.forEach(db => indexedDB.deleteDatabase(db.name!))
	})

	localStorage.clear()
	sessionStorage.clear()
}

export const randomColorGenerator = () => Math.floor(Math.random() * 16777215).toString(16)

export const capFrstLtr = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1)

export const numSuffix = (n: number) => numeral(n).format('0.0a')

export const numComma = (n: number) => numeral(n).format('0,0')

export const validateImg = (e: RcFile) => {
	const isWebpOrPng = e.type === 'image/webp' || e.type === 'image/png'
	const isLt10M = e.size / 1024 / 1024 < 10

	if (!isWebpOrPng) {
		message.error('You can only upload WEBP/PNG file!')
		return ''
	}

	if (!isLt10M) {
		message.error('Image must be smaller than 10MB!')
		return ''
	}
}
