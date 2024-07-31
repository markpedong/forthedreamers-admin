import { useEffect } from 'react'
import { useAppDispatch } from '@/redux/store'
import { resetUserData } from '@/redux/features/userSlice'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { getLocalStorage } from '@/utils/xLocalstorage'

export default function isAuth(Component: any) {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const auth = Cookies.get('Auth') || getLocalStorage('token')

	useEffect(() => {
		if (!auth) {
			dispatch(resetUserData())
			navigate('/')
		}
	}, [auth, dispatch, navigate])

	return Component
}
