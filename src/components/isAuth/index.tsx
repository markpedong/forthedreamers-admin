import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { resetUserData } from '@/redux/features/userSlice'
import { useNavigate } from 'react-router-dom'

export default function isAuth(Component: any) {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const id = useAppSelector(state => state.userData?.id)
	const token = useAppSelector(state => state.userData?.token)
	const auth = id && token

	useEffect(() => {
		if (!auth) {
			dispatch(resetUserData())
			navigate('/')
		}
	}, [auth, dispatch, navigate])

	return Component
}
