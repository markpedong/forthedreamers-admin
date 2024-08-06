import { useEffect, useRef, useState } from 'react'
import { getWebsiteData, uploadImage } from '@/api'
import { validateImg } from '@/constants/helper'
import { TWebsiteInfo } from '@/constants/response-type'
import { PlusOutlined } from '@ant-design/icons'
import { ProForm, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components'
import { FormInstance, Image, Spin, Upload } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
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
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
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

  const splitUrl = (url: string) => url?.split('/').pop()!

  const getFormData = async () => {
    const res = await getWebsiteData({})

    setInit(res?.data.data)
    console.log(res?.data.data)
    formRef.current?.setFieldsValue(res?.data?.data)
  }
  useEffect(() => {
    getFormData()
  }, [])

  return (
    <div>
      <ProForm
        layout='horizontal'
        grid
        formRef={formRef}
        onFinish={async params => {
          console.log(omit({ ...params, landing_image1: image1 || init?.landing_image1 }))
        }}
      >
        <ProFormText label='Website Name' name='website_name' required colProps={{ span: 12 }} />
        <ProFormText label='Marquee Text' name='marquee_text' required colProps={{ span: 12 }} />
        <ProFormTextArea label='Promo Text' name='promo_text' required colProps={{ span: 24 }} />
        <ProFormText label='Landing Image 1' colProps={{ span: 8 }}>
          {!uploading ? (
            <ProFormUploadButton
              title='UPLOAD LANDING IMAGE 1'
              rules={[{ required: true }]}
              colProps={{span: 24}}
              fieldProps={{
                onPreview: handlePreview,
                accept: 'image/*',
                listType: 'picture-card',
                beforeUpload: BeforeUpload,
                fileList: [
                  {
                    uid: '-1',
                    name: splitUrl(image1) || splitUrl(init?.landing_image1!),
                    status: 'done',
                    url: image1 || init?.landing_image1
                  }
                ],
                multiple: false,
                maxCount: 1,
                customRequest: async e => {
                  const file = e.file as RcFile

                  if (validateImg(file) === '') return
                  setUploading(true)

                  try {
                    const res = await uploadImage(file)
                    setImage1(res?.data.data.url)
                  } finally {
                    setUploading(false)
                  }
                },
                onRemove: () => setImage1('')
              }}
            >
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
            </ProFormUploadButton>
          ) : (
            <Spin />
          )}
        </ProFormText>
        <ProFormText label='Landing Image 1' colProps={{ span: 8 }}>
          {!uploading ? (
            <ProFormUploadButton
              title='UPLOAD LANDING IMAGE 1'
              rules={[{ required: true }]}
              colProps={{span: 24}}
              fieldProps={{
                onPreview: handlePreview,
                accept: 'image/*',
                listType: 'picture-card',
                beforeUpload: BeforeUpload,
                fileList: [
                  {
                    uid: '-1',
                    name: splitUrl(image1) || splitUrl(init?.landing_image1!),
                    status: 'done',
                    url: image1 || init?.landing_image1
                  }
                ],
                multiple: false,
                maxCount: 1,
                customRequest: async e => {
                  const file = e.file as RcFile

                  if (validateImg(file) === '') return
                  setUploading(true)

                  try {
                    const res = await uploadImage(file)
                    setImage1(res?.data.data.url)
                  } finally {
                    setUploading(false)
                  }
                },
                onRemove: () => setImage1('')
              }}
            >
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
            </ProFormUploadButton>
          ) : (
            <Spin />
          )}
        </ProFormText>
        <ProFormText label='Landing Image 1' colProps={{ span: 8 }}>
          {!uploading ? (
            <ProFormUploadButton
              title='UPLOAD LANDING IMAGE 1'
              rules={[{ required: true }]}
              colProps={{span: 24}}
              fieldProps={{
                onPreview: handlePreview,
                accept: 'image/*',
                listType: 'picture-card',
                beforeUpload: BeforeUpload,
                fileList: [
                  {
                    uid: '-1',
                    name: splitUrl(image1) || splitUrl(init?.landing_image1!),
                    status: 'done',
                    url: image1 || init?.landing_image1
                  }
                ],
                multiple: false,
                maxCount: 1,
                customRequest: async e => {
                  const file = e.file as RcFile

                  if (validateImg(file) === '') return
                  setUploading(true)

                  try {
                    const res = await uploadImage(file)
                    setImage1(res?.data.data.url)
                  } finally {
                    setUploading(false)
                  }
                },
                onRemove: () => setImage1('')
              }}
            >
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
            </ProFormUploadButton>
          ) : (
            <Spin />
          )}
        </ProFormText>
      </ProForm>
    </div>
  )
}

export default Website
