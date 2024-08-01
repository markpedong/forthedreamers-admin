import numeral from 'numeral'
import dayjs from 'dayjs'

export const formatNumber = (num: number, format: string = '0,0') => {
	return numeral(num).format(format)
}

export const ignoreFindDOMNodeError = () => {
	const originalConsoleError = console.error.bind(console)

	console.error = (...args) => {
		if (args.length > 0 && !!args[0]) {
			const error = args[0] as string
			if (error.includes('find')) {
				return
			}
		}
		originalConsoleError(...args)
	}
}

export const dateTimeFormatter = (date, format = 'MM-DD-YYYY') => dayjs.unix(date).format(format)

export const INPUT_TRIM = {
	getValueFromEvent: e => e?.target.value?.trim()
}

export const INPUT_LETTERS = {
	getValueFromEvent: e => {
		const trimmedValue = e?.target.value?.trim()
		const nonNumericValue = trimmedValue.replace(/[0-9]/g, '')
		return nonNumericValue
	}
}

export const INPUT_EMAIL = {
	getValueFromEvent: e => {
		const trimmedValue = e?.target.value?.trim()
		const validEmail = trimmedValue.replace(/[^\w.@+-]/g, '') // Remove characters not allowed in an email address
		return validEmail
	}
}

export const INPUT_NUMBER = {
	getValueFromEvent: e => {
		const trimmedValue = e?.target.value?.trim()
		const numericValue = trimmedValue.replace(/\D/g, '') // Allow only numeric characters
		return numericValue
	}
}
