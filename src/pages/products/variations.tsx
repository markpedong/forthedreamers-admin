import React, { FC, useRef, useState } from 'react'
import { addVariations, deleteVariations, getVariations, toggleVariations, updateVariations } from '@/api'
import { GLOBAL_STATUS } from '@/api/constants'
import { TProductItem, TVariationItem } from '@/constants/response-type'
import { INPUT_NUMBER, INPUT_TRIM, dateTimeFormatter } from '@/utils'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { EditableProTable } from '@ant-design/pro-components'
import { Popconfirm, Space, Switch, Typography, message } from 'antd'
import { omit } from 'lodash'
import { afterModalformFinish } from '@/utils/antd'

const Variations: FC<{ product: TProductItem }> = ({ product }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<readonly TVariationItem[]>([])
  const actionRef = useRef<ActionType>()
  const columns: ProColumns<TVariationItem>[] = [
    {
      title: 'Size',
      dataIndex: 'size',
      align: 'center',
      fieldProps: { placeholder: 'Enter Size', maxLength: 10 },
      formItemProps: () => ({
        ...INPUT_TRIM,
        rules: [{ required: true, message: 'Size is Required' }]
      })
    },
    {
      title: 'Color',
      dataIndex: 'color',
      align: 'center',
      fieldProps: { placeholder: 'Enter Color', maxLength: 10 },
      formItemProps: () => ({
        ...INPUT_TRIM,
        rules: [{ required: true, message: 'Color is Required' }]
      })
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      fieldProps: { placeholder: 'Enter Price', maxLength: 5 },
      formItemProps: () => ({
        ...INPUT_NUMBER,
        rules: [{ required: true, message: 'Price is Required' }]
      })
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      align: 'center',
      fieldProps: { placeholder: 'Enter Quantity', maxLength: 5 },
      formItemProps: () => ({
        ...INPUT_NUMBER,
        rules: [{ required: true, message: 'Quantity is Required' }]
      })
    },
    {
      title: (
        <div className='flex flex-col gap-0'>
          <div>Created</div>
          <div>Updated</div>
        </div>
      ),
      editable: false,
      align: 'center',
      render: (_, record) => (
        <div className='flex flex-col'>
          {record.created_at && <div>{dateTimeFormatter(record.created_at, 'MM-DD-YYYY HH:MM:ss')}</div>}
          {record.updated_at && <div>{dateTimeFormatter(record.updated_at, 'MM-DD-YYYY HH:MM:ss')}</div>}
        </div>
      )
    },
    {
      title: 'Operator',
      valueType: 'option',
      align: 'center',
      render: (_1, record, _, action) => (
        <Space>
          {renderSwitch(record)}
          <Typography.Link
            onClick={() => {
              action?.startEditable?.(record.id)
            }}
          >
            Edit
          </Typography.Link>
          <Popconfirm
            title='Delete this variation?'
            description='Are you sure to delete this?'
            onConfirm={async () => {
              const res = await deleteVariations({ id: record?.id })

              return afterModalformFinish(actionRef, res)
            }}
            okText='Yes'
            cancelText='No'
          >
            <Typography.Link type='danger'>Delete</Typography.Link>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const renderSwitch = (record: TVariationItem) => {
    return (
      <Switch
        unCheckedChildren='OFF'
        checkedChildren='ON'
        checked={record?.status === GLOBAL_STATUS.ON}
        onChange={async () => {
          const res = await toggleVariations({ id: record?.id })

          return afterModalformFinish(actionRef, res)
        }}
      />
    )
  }

  const fetchData = async () => {
    const res = await getVariations({ product_id: product?.id })

    return {
      data: res?.data.data ?? []
    }
  }

  return (
    <EditableProTable<TVariationItem>
      rowKey='id'
      headerTitle={`${product?.name}'s variations`}
      maxLength={5}
      recordCreatorProps={{
        record: () => ({ id: (Math.random() * 10).toFixed(0) })
      }}
      actionRef={actionRef}
      loading={false}
      columns={columns}
      request={fetchData}
      value={dataSource}
      onChange={setDataSource}
      editable={{
        type: 'multiple',
        editableKeys,
        onSave: async (_, data) => {
          let res
          let payload = omit({ ...data, price: +data?.price!, quantity: +data?.quantity! }, [
            'created_at',
            'index',
            'updated_at',
            'status',
            'product_id'
          ])

          if (data?.id.includes('-')) {
            res = await updateVariations(payload)
          } else {
            if (Object.values(payload).includes('' || NaN)) return message.error('must have all values')

            res = await addVariations({ ...payload, product_id: product?.id })
          }

          return afterModalformFinish(actionRef, res)
        },
        onChange: setEditableRowKeys,
        saveText: <span className='text-green-500'>Save</span>,
        cancelText: <span className='text-blue-500'>Cancel</span>
      }}
    />
  )
}

export default Variations
