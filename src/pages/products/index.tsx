import { addProduct, getCollections, getProducts, toggleProducts, updateProduct, uploadImage } from '@/api'
import { GLOBAL_STATUS } from '@/api/constants'
import { MODAL_FORM_PROPS, PRO_TABLE_PROPS } from '@/constants'
import { validateImg } from '@/constants/helper'
import { TProductItem } from '@/constants/types'
import { dateTimeFormatter } from '@/utils'
import type { ProColumns } from '@ant-design/pro-components'
import {
  ActionType,
  ModalForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProTable
} from '@ant-design/pro-components'
import { Button, Image, Space, Spin, Switch, Typography, UploadFile } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { omit } from 'lodash'
import { useRef, useState } from 'react'
import { afterModalformFinish } from '@/utils/antd'
import styles from './styles.module.scss'
import Variations from './variations'

const Products = () => {
  const [uploadedImages, setUploadedImages] = useState<{ url: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const actionRef = useRef<ActionType>()
  const columns: ProColumns<TProductItem>[] = [
    // {
    //   title: 'Collection',
    //   align: 'center',
    //   dataIndex: 'collection_id'
    // },
    {
      title: 'Name',
      align: 'center',
      dataIndex: 'name'
    },
    {
      title: 'Description',
      align: 'center',
      dataIndex: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Images',
      align: 'center',
      search: false,
      ellipsis: true,
      render: (_, record) => {
        return (
          <div className={styles.imgContainer}>
            {record?.images.map(img => (
              <Image src={img} key={img} />
            ))}
          </div>
        )
      }
    },
    {
      title: (
        <div className='flex flex-col gap-0'>
          <div>Created</div>
          <div>Updated</div>
        </div>
      ),
      search: false,
      align: 'center',
      width: 160,
      render: (_, record) => (
        <div className='flex flex-col'>
          <div>{dateTimeFormatter(record.created_at, 'MM-DD-YYYY HH:MM:ss')}</div>
          <div>{dateTimeFormatter(record.updated_at, 'MM-DD-YYYY HH:MM:ss')}</div>
        </div>
      )
    },
    {
      title: 'Operator',
      align: 'center',
      search: false,
      width: 160,
      render: (_, record) => (
        <Space>
          {renderSwitch(record)}
          {renderAddEditProducts('EDIT', record)}
          {/* {renderDeleteBlogs(record)} */}
        </Space>
      )
    }
  ]

  const renderSwitch = (record: TProductItem) => {
    return (
      <Switch
        unCheckedChildren='OFF'
        checkedChildren='ON'
        checked={record?.status === GLOBAL_STATUS.ON}
        onChange={async () => {
          const res = await toggleProducts({ id: record?.id })

          return afterModalformFinish(actionRef, res)
        }}
      />
    )
  }

  const getCollectionsData = async () => {
    const res = await getCollections({})
    const options = res?.data.data.map(option => ({
      label: option?.name,
      value: option?.id
    }))

    return options ?? []
  }

  const handleCustomRequest = async (e: any) => {
    const file = e.file as RcFile

    if (validateImg(file) === '') return

    setUploading(true)

    try {
      const res = await uploadImage(file)
      setUploadedImages(state => [...state, { ...file, url: res.data.data.url }])
    } finally {
      setUploading(false)
    }
  }

  const renderAddEditProducts = (type: 'ADD' | 'EDIT', record?: TProductItem) => {
    const isEdit = type === 'EDIT'
    const transformedFeatures = isEdit && record?.features ? record.features.map(feature => ({ feature })) : []

    return (
      <ModalForm
        {...MODAL_FORM_PROPS}
        labelCol={{ flex: '120px' }}
        initialValues={isEdit ? { ...record, features: transformedFeatures } : {}}
        title={isEdit ? 'Edit Product' : 'Add Product'}
        grid
        trigger={
          isEdit ? (
            <Typography.Link
              onClick={() => {
                setUploadedImages(record?.images.map(img => ({ url: img })) || [])
              }}
            >
              Edit
            </Typography.Link>
          ) : (
            <Button type='primary'>ADD</Button>
          )
        }
        onFinish={async params => {
          let res
          const payload = omit(
            { ...params, images: uploadedImages?.map(img => img?.url), features: params.features?.map(item => item?.feature) },
            ['upload']
          )

          if (isEdit) {
            res = await updateProduct({ ...payload, id: record?.id })
          } else {
            res = await addProduct({ ...payload })
            setUploadedImages([])
          }

          return afterModalformFinish(actionRef, res)
        }}
        onOpenChange={visible => !visible && setUploadedImages([])}
      >
        <ProFormText
          label='Name'
          name='name'
          placeholder='Enter Product name'
          fieldProps={{ maxLength: 30 }}
          colProps={{ span: 12 }}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          label='CollectionID'
          name='collection_id'
          rules={[{ required: true }]}
          allowClear={false}
          request={getCollectionsData}
          colProps={{ span: 12 }}
        />
        <ProFormTextArea
          label='Description'
          name='description'
          rules={[{ required: true }]}
          placeholder='Enter Description for the product'
        />

        <ProFormText label='Images' rules={[{ required: true }]}>
          <div className={styles.galleryContainer}>
            {uploading ? (
              <Spin />
            ) : (
              <ProFormUploadButton
                name='upload'
                title='UPLOAD YOUR IMAGE'
                fieldProps={{
                  listType: 'picture-card',
                  accept: 'image/*',
                  multiple: true,
                  onRemove: e => {
                    setUploadedImages(s => s.filter(q => q?.url !== e?.url))
                  },
                  fileList: uploadedImages as UploadFile<any>[],
                  customRequest: handleCustomRequest
                }}
              />
            )}
          </div>
        </ProFormText>
        <ProFormList
          name='features'
          label='Product Features'
          creatorButtonProps={{
            creatorButtonText: 'Add feature text'
          }}
          min={1}
          copyIconProps={false}
          creatorRecord={{ feature: '' }}
        >
          <ProFormText name='feature' required />
        </ProFormList>
      </ModalForm>
    )
  }

  const fetchData = async () => {
    const res = await getProducts({})

    return {
      data: res?.data.data ?? []
    }
  }

  return (
    <ProTable
      {...PRO_TABLE_PROPS}
      rowKey='id'
      columns={columns}
      actionRef={actionRef}
      search={false}
      request={fetchData}
      toolBarRender={() => [renderAddEditProducts('ADD')]}
      expandable={{
        expandedRowRender: record => <Variations product={record} />
      }}
    />
  )
}

export default Products
