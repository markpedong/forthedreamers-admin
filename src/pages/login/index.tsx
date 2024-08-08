import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginFormPage, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import { theme } from 'antd'
import { motion } from 'framer-motion'
import { setUserInfo } from '@/redux/features/userSlice'
import { useAppDispatch } from '@/redux/store'
import { afterModalformFinish } from '@/utils/antd'
import { setLocalStorage } from '@/utils/xLocalstorage'
import styles from './styles.module.scss'

const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
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
        backgroundVideoUrl='https://res.cloudinary.com/dmewvemeu/video/upload/v1722582919/forthedreamers/creatives/b3ryyfowttpwgpmktmsk.mp4'
        title='For the Dreamers'
        subTitle={<span style={{ color: 'white' }}>Access CMS For the Dreamers</span>}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)'
        }}
        formRef={formRef}
        onFinish={async params => {
          const res = await login(params)
          if (res?.data.success) {
            setLocalStorage('token', res?.data.data.token)
            await dispatch(setUserInfo(res?.data?.data))
            formRef?.current?.resetFields()
            navigate('/app/users')
          }

          return afterModalformFinish(undefined, res, formRef)
        }}
        submitter={{
          render: props => {
            return (
              <div className={styles.submitBtnContainer}>
                <motion.div onClick={() => props.submit()} whileTap={{ scale: 0.98 }}>
                  Login
                </motion.div>
                <div>v {import.meta.env.PACKAGE_VERSION}</div>
              </div>
            )
          }
        }}
      >
        <ProFormText
          name='username'
          fieldProps={{
            size: 'large',
            prefix: (
              <UserOutlined
                style={{
                  color: token.colorText
                }}
                className='prefixIcon'
              />
            )
          }}
          placeholder='admin'
          rules={[
            {
              required: true,
              message: '请输入用户名!'
            }
          ]}
        />
        <ProFormText.Password
          name='password'
          fieldProps={{
            prefix: (
              <LockOutlined
                style={{
                  color: token.colorText
                }}
                className='prefixIcon'
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
