import { login } from '@/api'
import { setUserInfo } from '@/redux/features/userSlice'
import { useAppDispatch } from '@/redux/store'
import { afterModalformFinish } from '@/utils/antd'
import { setLocalStorage } from '@/utils/xLocalstorage'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginFormPage, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import { theme } from 'antd'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'

const Login = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const formRef = useRef<ProFormInstance>()
	const { token } = theme.useToken()

	return (
		<div
			style={{
				backgroundColor: 'black',
				height: '100vh'
			}}
			className={styles.loginContainer}
		>
			<LoginFormPage
				backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
				title={'For the Dreamers'}
				subTitle={<span style={{ color: 'white' }}>Access CMS for For the Dreamers</span>}
				containerStyle={{
					backgroundColor: 'rgba(0, 0, 0,0.65)',
					backdropFilter: 'blur(4px)'
				}}
				formRef={formRef}
				onFinish={async params => {
					const res = await login(params)
					if (res?.data.success) {
						setLocalStorage('token', res?.data.data.token)
						await dispatch(setUserInfo(res?.data?.data.userInfo))
						formRef?.current?.resetFields()
						navigate('/app')
					}

					return afterModalformFinish(undefined, res, formRef)
				}}
			>
				<ProFormText
					name="username"
					fieldProps={{
						size: 'large',
						prefix: (
							<UserOutlined
								style={{
									color: token.colorText
								}}
								className="prefixIcon"
							/>
						)
					}}
					placeholder="admin"
					rules={[
						{
							required: true,
							message: '请输入用户名!'
						}
					]}
				/>
				<ProFormText.Password
					name="password"
					fieldProps={{
						prefix: (
							<LockOutlined
								style={{
									color: token.colorText
								}}
								className="prefixIcon"
							/>
						)
					}}
					placeholder={'Password: ant.design'}
					rules={[
						{
							required: true,
							message: 'Password is required'
						}
					]}
				/>
			</LoginFormPage>
		</div>
	)
}

export default Login
