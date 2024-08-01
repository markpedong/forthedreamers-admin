import { getVariations } from '@/api'
import { TProductItem, TVariationItem } from '@/constants/response-type'
import { dateTimeFormatter } from '@/utils'
import type { ProColumns } from '@ant-design/pro-components'
import { EditableProTable } from '@ant-design/pro-components'
import { Typography } from 'antd'
import React, { FC, useState } from 'react'

const waitTime = (time: number = 100) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true)
		}, time)
	})
}

const Variations: FC<{ record: TProductItem }> = ({ record }) => {
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
				<Typography.Link
					onClick={() => {
						action?.startEditable?.(record.id)
					}}
				>
					Edit
				</Typography.Link>
			)
		}
	]

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
			maxLength={5}
			scroll={{
				x: 960
			}}
			recordCreatorProps={{
				record: () => ({ id: (Math.random() * 1000000).toFixed(0) })
			}}
			loading={false}
			columns={columns}
			request={fetchData}
			value={dataSource}
			onChange={setDataSource}
			editable={{
				type: 'multiple',
				editableKeys,
				onSave: async (rowKey, data, row) => {
					console.log('@@@', rowKey, data, row)
					await waitTime(2000)
				},
				onChange: setEditableRowKeys,
				saveText: <span className="text-green-500">Save</span>,
				deleteText: <span className="text-red-500">Delete</span>,
				cancelText: <span className="text-blue-500">Cancel</span>
			}}
		/>
	)
}

export default Variations
