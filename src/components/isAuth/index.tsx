import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { resetUserData } from '@/redux/features/userSlice'
import { useNavigate } from 'react-router-dom'
import { getLocalStorage } from '@/utils/xLocalstorage'

export default function isAuth(Component: any) {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const userInfo = useAppSelector(state => state.userData?.userInfo)
	const auth = userInfo?.id || !!getLocalStorage('token')

	useEffect(() => {
		if (!auth) {
			dispatch(resetUserData())
			navigate('/')
		}
	}, [auth, dispatch, navigate])

	return Component
}
