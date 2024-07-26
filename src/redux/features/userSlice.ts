import { UserInfo } from '@/constants/response-type'
import { createSlice } from '@reduxjs/toolkit'

type InitialSlice = UserInfo & {
	token: string
}

const initialState: InitialSlice = {
	id: '',
	created_at: 0,
	updated_at: 0,
	password: '',
	email: '',
	first_name: '',
	username: '',
	address: '',
	image: '',
	last_name: '',
	phone: '',
	token: ''
}

export const UserSlice = createSlice({
	name: 'User',
	initialState,
	reducers: {
		resetUserData: () => initialState,
		setUserInfo: (state, action) => ({ ...state, userData: action.payload }),
		setUserToken: (state, action) => ({ ...state, token: action.payload })
	}
})

export const { setUserInfo, resetUserData, setUserToken } = UserSlice.actions
export default UserSlice.reducer
