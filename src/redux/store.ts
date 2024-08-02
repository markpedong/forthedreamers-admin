import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { compress, decompress } from 'lz-string'
import { createTransform, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import booleanReducer from './features/booleanSlice'
import userReducer from './features/userSlice'

type RootType = {
  boolean: ReturnType<typeof booleanReducer>
  userData: ReturnType<typeof userReducer>
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  transforms: [
    createTransform(
      i => compress(JSON.stringify(i)),
      o => JSON.parse(decompress(o))
    )
  ]
}

const reducer = combineReducers({
  boolean: booleanReducer,
  user: userReducer
})

//@ts-ignore
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
