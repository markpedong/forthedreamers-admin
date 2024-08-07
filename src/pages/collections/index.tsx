import { addCollection, deleteCollection, getCollections, toggleCollection, updateCollection, uploadImage } from '@/api'
import { GLOBAL_STATUS } from '@/api/constants'
import { MODAL_FORM_PROPS, PRO_TABLE_PROPS } from '@/constants'
import { validateImg } from '@/constants/helper'
import { TCollectionItem } from '@/constants/types'
import { dateTimeFormatter } from '@/utils'
import { afterModalformFinish } from '@/utils/antd'
import {
	ActionType,
	ModalForm,
	ProColumns,
	ProFormText,
	ProFormUploadButton,
	ProTable
} from '@ant-design/pro-components'
import { Button, Image, Popconfirm, Space, Spin, Switch, Typography, UploadFile } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { omit } from 'lodash'
import { useRef, useState } from 'react'
import styles from './styles.module.scss'

const Collections = () => {
	const [uploadedImages, setUploadedImages] = useState<{ url: string }[]>([])
	const [uploading, setUploading] = useState(false)
	const actionRef = useRef<ActionType>()
	const columns: ProColumns<TCollectionItem>[] = [
		{
			title: 'Name',
			align: 'center',
			dataIndex: 'name'
		},
		{
			title: 'Images',
			align: 'center',
			search: false,
			render: (_, record) => {
				return <div className={styles.imgContainer}>{record?.images.map(img => <Image key={img} src={img} />)}</div>
			}
		},
		{
			title: (
				<div className="flex flex-col gap-0">
					<span className="leading-4">Created</span>
					<span className="leading-4">Updated</span>
				</div>
			),
			search: false,
			align: 'center',
			width: 160,
			render: (_, record) => (
				<div className="flex flex-col">
					<span className="leading-4">{dateTimeFormatter(record.created_at, 'MM-DD-YYYY HH:MM:ss')}</span>
					<span className="leading-4">{dateTimeFormatter(record.updated_at, 'MM-DD-YYYY HH:MM:ss')}</span>
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
					{renderAddEditCollections('EDIT', record)}
					{renderDeleteCollections(record)}
				</Space>
			)
		}
	]

	const renderSwitch = (record: TCollectionItem) => {
		return (
			<Switch
			  unCheckedChildren='OFF'
			  checkedChildren='ON'
			  checked={record?.status === GLOBAL_STATUS.ON}
			  onChange={async () => {
				const res = await toggleCollection({ id: record?.id })
	  
				return afterModalformFinish(actionRef, res)
			  }}
			/>
		  )
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

	const renderAddEditCollections = (type: 'ADD' | 'EDIT', record?: TCollectionItem) => {
		const isEdit = type === 'EDIT'
		return (
			<ModalForm
				{...MODAL_FORM_PROPS}
				labelCol={{ flex: '65px' }}
				initialValues={isEdit ? record : {}}
				title={isEdit ? 'Edit Collection' : 'Add Collection'}
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
						<Button type="primary">ADD</Button>
					)
				}
				onFinish={async params => {
					let res
					const payload = omit({ ...params, images: uploadedImages?.map(img => img?.url) }, ['upload'])

					if (isEdit) {
						res = await updateCollection({ ...payload, id: record?.id })
					} else {
						res = await addCollection({ ...payload })
						setUploadedImages([])
					}

					return afterModalformFinish(actionRef, res)
				}}
				onOpenChange={visible => !visible && setUploadedImages([])}
			>
				<ProFormText label="Name" name="name" rules={[{ required: true }]} />
				<ProFormText label="Images" rules={[{ required: true }]}>
					<div className={styles.galleryContainer}>
						{uploading ? (
							<Spin />
						) : (
							<ProFormUploadButton
								name="upload"
								title="UPLOAD YOUR IMAGE"
								fieldProps={{
									name: 'files',
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
			</ModalForm>
		)
	}

	const renderDeleteCollections = (record: TCollectionItem) => {
		return (
			<Popconfirm
				title="Delete this Collection?"
				onConfirm={async () => {
					const res = await deleteCollection({ id: record?.id })

					return afterModalformFinish(actionRef, res)
				}}
			>
				<Typography.Link type="danger">Delete</Typography.Link>
			</Popconfirm>
		)
	}

	const fetchData = async () => {
		const res = await getCollections({})

		return {
			data: res?.data.data ?? []
		}
	}

	return (
		<div>
			<ProTable
				{...PRO_TABLE_PROPS}
				rowKey="id"
				columns={columns}
				actionRef={actionRef}
				request={fetchData}
				toolBarRender={() => [renderAddEditCollections('ADD')]}
				scroll={{ x: 700 }}
			/>
		</div>
	)
}

export default Collections
