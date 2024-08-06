import React, { MutableRefObject } from 'react'
import { ApiResponse } from '@/api/http'
import { FileType } from '@/constants/types'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { ActionType, ProFormInstance } from '@ant-design/pro-components'
import { ConfigProvider, message, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import { useAppSelector } from '@/redux/store'

export const afterModalformFinish = (
  actionRef?: MutableRefObject<ActionType | undefined>,
  res?: ApiResponse<any>,
  formRef?: MutableRefObject<ProFormInstance | undefined>
) => {
  if (actionRef) {
    actionRef?.current?.reload()
  }

  if (formRef) {
    formRef?.current?.setFieldsValue(res?.data.data)
  }

  if (res?.data?.success) {
    message.success(res?.data?.message)
  }

  return !!res?.data?.success
}

export const renderPercentage = percentage => {
  const per = percentage?.toFixed(2)

  return (
    <span
      style={{
        color: per > 0.0 ? '#16c784' : '#ea3943'
      }}
    >
      {per > 0.0 ? <CaretUpOutlined /> : per < 0.0 ? <CaretDownOutlined /> : !per && ''} {per?.replace('-', '')}
    </span>
  )
}

export const AntdConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = useAppSelector(s => s.boolean)

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: '#16c784', fontFamily: 'Inter', fontSize: 12 }
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export const BeforeUpload = (file: FileType) => {
  const isJpgOrPngOrSvg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
  if (!isJpgOrPngOrSvg) {
    message.error('You can only upload jpg/png/webp file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPngOrSvg && isLt2M
}
