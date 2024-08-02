import { FC } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import App from '@/pages/app'
import menus from '@/pages/menus'
import { cloneDeep } from 'lodash'
import isAuth from '@/components/isAuth'
import Login from './login'

const Root: FC = () => {
  const menu = cloneDeep(menus)
  const protectedMenu = menu.map(route => ({
    ...route,
    element: route.path.includes('/app') ? isAuth(route.element) : route.element
  }))

  return useRoutes([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/app',
      element: <App />,
      children: [
        ...protectedMenu,
        {
          path: '*',
          element: <Navigate to='/' />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to='/' />
    }
  ])
}

export default Root
