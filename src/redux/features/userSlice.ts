import { InitialState } from '@/constants/response-type'
import { createSlice } from '@reduxjs/toolkit'

const initialState: InitialState = {
  userInfo: {
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
    phone: ''
  },
  refresh_token: '',
  token: ''
}

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    resetUserData: () => initialState,
    setUserInfo: (state, action) => ({ ...state, ...action.payload })
  }
})

export const { setUserInfo, resetUserData } = UserSlice.actions
export default UserSlice.reducer
