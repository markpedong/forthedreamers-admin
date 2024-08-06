import { useRef, useState } from 'react'
import { getWebsiteData, uploadImage } from '@/api'
import { validateImg } from '@/constants/helper'
import { TWebsiteInfo } from '@/constants/response-type'
import { ProForm, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { FormInstance, Image, Spin } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { omit } from 'lodash'
import { BeforeUpload } from '@/utils/antd'

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

  const handleCustomRequest = async (e: any) => {
    const file = e.file as RcFile

    if (validateImg(file) === '') return

    setUploading(true)

    try {
      const res = await uploadImage(file)

      setInit(prev => ({ ...prev, landing_image1: res?.data.data.url }))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <ProForm
        layout='horizontal'
        grid
        request={getFormData}
        formRef={formRef}
        onFinish={async params => {
          console.log(omit({ ...params, landing_image1: init?.landing_image1 }))
        }}
      >
        <ProFormText label='Website Name' name='website_name' required colProps={{ span: 12 }} />
        <ProFormText label='Marquee Text' name='marquee_text' required colProps={{ span: 12 }} />
        <ProFormTextArea label='Promo Text' name='promo_text' required colProps={{ span: 24 }} />
        <ProFormText label='Landing Image 1' rules={[{ required: true }]}>
          {uploading ? (
            <Spin />
          ) : (
            <ProFormUploadButton
              name='upload'
              title='UPLOAD YOUR IMAGE'
              fieldProps={{
                name: 'files',
                onPreview: handlePreview,
                beforeUpload: BeforeUpload,
                listType: 'picture-card',
                accept: 'image/*',
                maxCount: 1,
                multiple: false,
                onRemove: () => {
                  setInit(prev => ({ ...prev, landing_image1: '' }))
                },
                fileList: init?.landing_image1 ? ([{ url: init?.landing_image1 }] as UploadFile<any>[]) : [],
                customRequest: handleCustomRequest
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
      </ProForm>
    </div>
  )
}

export default Website
