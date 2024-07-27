import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { resetUserData } from '@/redux/features/userSlice'
import { useNavigate } from 'react-router-dom'

export default function isAuth(Component: any) {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const user = useAppSelector(state => state.userData)
	const auth = user?.id && user?.token

	useEffect(() => {
		if (!auth) {
			dispatch(resetUserData())
			navigate('/')
		}
	}, [auth, dispatch, navigate])

	return Component
}
