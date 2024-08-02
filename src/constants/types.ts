import type { GetProp, UploadProps } from 'antd'

// /api/uploadImage
export type TUploadImage = {
  url: string
  fileName: string
  size: number
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
