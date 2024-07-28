import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'
import menus from '@/pages/menus'
import { DownOutlined } from '@ant-design/icons'
import { ActionType, ProLayout } from '@ant-design/pro-components'
import { Dropdown, Switch, Typography } from 'antd'
import { cloneDeep } from 'lodash'
import { FC, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'
import { setDarkMode } from '@/redux/features/booleanSlice'
import { clearUserData } from '@/constants/helper'
import { resetUserData } from '@/redux/features/userSlice'

const App: FC = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { pathname } = useLocation()
	const { darkMode } = useAppSelector(s => s.boolean)
	const actionRef = useRef<ActionType>()
	const items: MenuProps['items'] = [
		{
			key: '1',
			danger: true,
			label: 'Logout',
			onClick: () => {
				clearUserData()
				dispatch(resetUserData())
				navigate('/')
				window.location.reload()
			}
		}
	]

	const renderDarkMode = () => (
		<Switch
			onChange={() => dispatch(setDarkMode())}
			checkedChildren={<IoMdMoon />}
			unCheckedChildren={<IoMdSunny />}
			className="w-13 rounded-full"
		/>
	)

	return (
		<ProLayout
			location={{ pathname }}
			actionRef={actionRef}
			fixSiderbar
			fixedHeader
			layout="mix"
			headerTitleRender={props => <>{props}</>}
			logo={
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<img src={darkMode ? logoDark : logo} />
					<h1>For the Dreamers</h1>
				</div>
			}
			route={{ routes: cloneDeep(menus) }}
			menuItemRender={(item, dom) => {
				return (
					<Typography.Link style={{ paddingBlockStart: '0.5rem' }} onClick={() => navigate(item.path as string)}>
						{dom}
					</Typography.Link>
				)
			}}
			actionsRender={() => [
				renderDarkMode(),
				<Dropdown menu={{ items }}>
					<a onClick={e => e.preventDefault()}>
						<DownOutlined />
					</a>
				</Dropdown>
			]}
		>
			<Outlet />
		</ProLayout>
	)
}

export default App
