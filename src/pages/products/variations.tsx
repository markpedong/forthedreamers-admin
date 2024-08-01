import { deleteVariations, getVariations, toggleVariations, updateVariations } from '@/api'
import { GLOBAL_STATUS } from '@/api/constants'
import { TProductItem, TVariationItem } from '@/constants/response-type'
import { dateTimeFormatter } from '@/utils'
import { afterModalformFinish } from '@/utils/antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { EditableProTable } from '@ant-design/pro-components'
import { Space, Switch, Typography } from 'antd'
import { omit } from 'lodash'
import React, { FC, useRef, useState } from 'react'

const Variations: FC<{ record: TProductItem }> = ({ record }) => {
	const actionRef = useRef<ActionType>()
	const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
	const [dataSource, setDataSource] = useState<readonly TVariationItem[]>([])
	const columns: ProColumns<TVariationItem>[] = [
		{
			title: 'Size',
			dataIndex: 'size',
			align: 'center'
		},
		{
			title: 'Color',
			dataIndex: 'color',
			align: 'center'
		},
		{
			title: 'Price',
			dataIndex: 'price',
			align: 'center'
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			align: 'center'
		},
		{
			title: (
				<div className="flex flex-col gap-0">
					<div>Created</div>
					<div>Updated</div>
				</div>
			),
			editable: false,
			align: 'center',
			render: (_, record) => (
				<div className="flex flex-col">
					<div>{dateTimeFormatter(record.created_at, 'MM-DD-YYYY HH:MM:ss')}</div>
					<div>{dateTimeFormatter(record.updated_at, 'MM-DD-YYYY HH:MM:ss')}</div>
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
				</Space>
			)
		}
	]

	const renderSwitch = (record: TVariationItem) => {
		return (
			<Switch
				unCheckedChildren="OFF"
				checkedChildren="ON"
				checked={record?.status === GLOBAL_STATUS.ON}
				onChange={async () => {
					const res = await toggleVariations({ id: record?.id })

					return afterModalformFinish(actionRef, res)
				}}
			/>
		)
	}

	const fetchData = async () => {
		const res = await getVariations({ id: record?.id })

		return {
			data: res?.data.data ?? []
		}
	}

	return (
		<EditableProTable<TVariationItem>
			rowKey="id"
			headerTitle={`${record?.name}'s variations`}
			maxLength={10}
			recordCreatorProps={{
				record: () => ({ id: (Math.random() * 1).toFixed(0) })
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

					console.log(data)
					// const res = await updateVariations(
					// 	omit({ ...data, price: +data?.price!, quantity: +data?.quantity! }, [
					// 		'created_at',
					// 		'index',
					// 		'updated_at',
					// 		'status',
					// 		'product_id'
					// 	])
					// )

					return afterModalformFinish(actionRef, res)
				},
				onChange: setEditableRowKeys,
				onDelete: async (_, data) => {
					const res = await deleteVariations({ id: data?.id })

					return afterModalformFinish(actionRef, res)
				},
				saveText: <span className="text-green-500">Save</span>,
				deleteText: <span className="text-red-500">Delete</span>,
				cancelText: <span className="text-blue-500">Cancel</span>
			}}
		/>
	)
}

export default Variations
