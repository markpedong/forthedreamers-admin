import { getWebsiteData, updateWebsiteData, uploadImage } from '@/api'
import { validateImg } from '@/constants/helper'
import { TWebsiteInfo } from '@/constants/types'
import { ProForm, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { FormInstance, Image, Spin } from 'antd'
import { RcFile } from 'antd/lib/upload'
import omit from 'lodash/omit'
import { useRef, useState } from 'react'
import { BeforeUpload, afterModalformFinish } from '@/utils/antd'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

const Website = () => {
  const formRef = useRef<FormInstance>()
  const [init, setInit] = useState<TWebsiteInfo>()
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const getFormData = async () => {
    const res = await getWebsiteData({})

    setInit(res?.data.data)
    return res?.data.data
  }

  const handleCustomRequest = async (e: any, type: '1' | '2' | '3') => {
    const file = e.file as RcFile

    if (validateImg(file) === '') return

    setUploading(true)

    try {
      const res = await uploadImage(file)

      setInit(prev => ({
        ...prev,
        ...(type === '1' && { landing_image1: res?.data.data?.url! }),  
        ...(type === '2' && { landing_image2: res?.data.data?.url! }),
        ...(type === '3' && { landing_image3: res?.data.data?.url! })
      }))
    } finally {
      setUploading(false)
    }
  }

  const renderImageContainer = (type: '1' | '2' | '3') => {
    return (
      <ProFormText label={`Landing Image ${type}`} rules={[{ required: true }]} colProps={{ span: 8 }}>
        {uploading ? (
          <Spin />
        ) : (
          <ProFormUploadButton
            title='UPLOAD YOUR IMAGE'
            fieldProps={{
              name: 'files',
              onPreview: handlePreview,
              beforeUpload: BeforeUpload,
              listType: 'picture-card',
              accept: 'image/*',
              maxCount: 1,
              multiple: false,
              onRemove: () =>
                setInit(prev => ({
                  ...prev,
                  ...(type === '1' && { landing_image1: '' }),
                  ...(type === '2' && { landing_image2: '' }),
                  ...(type === '3' && { landing_image3: '' })
                })),
              fileList: (() => {
                const url = init?.[`landing_image${type}`]
                return url ? [{ url }] : []
              })() as UploadFile<any>[],
              customRequest: e => handleCustomRequest(e, type)
            }}
          />
        )}
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: visible => setPreviewOpen(visible),
              afterOpenChange: visible => !visible && setPreviewImage('')
            }}
            src={previewImage}
          />
        )}
      </ProFormText>
    )
  }

  return (
    <div>
      <ProForm
        layout='horizontal'
        grid
        request={getFormData}
        onReset={getFormData}
        formRef={formRef}
        onFinish={async params => {
          const payload = omit({
            ...init,
            ...params,
            landing_image1: init?.landing_image1,
            landing_image2: init?.landing_image2,
            landing_image3: init?.landing_image3
          })

          const res = await updateWebsiteData(payload)

          getFormData()
          return afterModalformFinish(undefined, res, formRef)
        }}
      >
        <ProFormText label='Website Name' name='website_name' required colProps={{ span: 12 }} />
        <ProFormText label='Marquee Text' name='marquee_text' required colProps={{ span: 12 }} />
        <ProFormTextArea label='Promo Text' name='promo_text' required colProps={{ span: 12 }} />
        <ProFormTextArea label='News Text' name='news_text' required colProps={{ span: 12 }} />
        {renderImageContainer('1')}
        {renderImageContainer('2')}
        {renderImageContainer('3')}
      </ProForm>
    </div>
  )
}

export default Website
