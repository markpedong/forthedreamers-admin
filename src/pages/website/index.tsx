import { getWebsiteData, uploadImage } from '@/api'
import { TWebsiteInfo } from '@/constants/response-type'
import { PlusOutlined } from '@ant-design/icons'
import { ProForm, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components'
import { FormInstance, Image, Upload } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { useEffect, useRef, useState } from 'react'

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
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setImage1(newFileList[0]?.url!)

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )
  const splitUrl = (url: string) => url.split('/').pop()!

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
      <ProForm layout='horizontal' grid formRef={formRef}>
        <ProFormText label='Website Name' name='website_name' required colProps={{ span: 12 }} />
        <ProFormText label='Marquee Text' name='marquee_text' required colProps={{ span: 12 }} />
        <ProFormTextArea label='Promo Text' name='promo_text' required colProps={{ span: 24 }} />
        <ProFormText label='Landing Image 1' required colProps={{ span: 8 }}>
          <Upload
            listType='picture-card'
            fileList={[
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: init?.landing_image1
              }
            ]}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
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
        <ProFormUploadButton
          label='Landing Image 2'
          name='landing_image2'
          title='UPLOAD LANDING IMAGE 2'
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
          fieldProps={{
            accept: 'image/*',
            listType: 'picture-card',
            fileList: [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                type: 'img'
              }
            ],
            multiple: false,
            maxCount: 1,
            customRequest: async e => {
              setImage2('')

              const res = await uploadImage(e?.file)
              if (res.data.success) {
                setImage2(res.data.data.url)
              } else {
                console.error('Failed to upload IMG or retrieve URL.')
              }
            },
            onRemove: () => setImage2('')
          }}
        />
        <ProFormUploadButton
          label='Landing Image 3'
          name='landing_image3'
          title='UPLOAD LANDING IMAGE 3'
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
          fieldProps={{
            accept: 'image/*',
            listType: 'picture-card',
            fileList:
              image3 || init?.landing_image3
                ? [
                    {
                      uid: '-1',
                      name: splitUrl(image3) || splitUrl(init?.landing_image3!),
                      status: 'done',
                      url: image3,
                      type: 'img'
                    }
                  ]
                : [],
            multiple: false,
            maxCount: 1,
            customRequest: async e => {
              setImage3('')

              const res = await uploadImage(e?.file)
              if (res.data.success) {
                setImage3(res.data.data.url)
              } else {
                console.error('Failed to upload IMG or retrieve URL.')
              }
            },
            onRemove: () => setImage3('')
          }}
        />
      </ProForm>
    </div>
  )
}

export default Website
