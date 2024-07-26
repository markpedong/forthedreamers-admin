import { MODAL_FORM_PROPS, PRO_TABLE_PROPS } from '@/constants'
import { TProductItem } from '@/constants/response-type'
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
import { Button, Image, message, Space, Spin, Typography, UploadFile } from 'antd'
import { useRef, useState } from 'react'
import styles from './styles.module.scss'
import { addProduct, getProduct, updateProduct, uploadImage } from '@/api'

const Products = () => {
	const [uploadedImages, setUploadedImages] = useState<{ url: string }[]>([])
	const [uploading, setUploading] = useState(false)
	const actionRef = useRef<ActionType>()
	const columns: ProColumns<TProductItem>[] = [
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
				return <div className={styles.imgContainer}>{record?.images.map(img => <Image src={img} />)}</div>
			}
		},
		{
			title: (
				<div className="flex flex-col gap-0">
					<div>Created</div>
					<div>Updated</div>
				</div>
			),
			search: false,
			align: 'center',
			width: 160,
			render: (_, record) => (
				<div className="flex flex-col">
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
					{/* {renderSwitch(record)} */}
					{renderAddEditProducts('EDIT', record)}
					{/* {renderDeleteBlogs(record)} */}
				</Space>
			)
		}
	]

	const renderAddEditProducts = (type: 'ADD' | 'EDIT', record?: TProductItem) => {
		const isEdit = type === 'EDIT'
		return (
			<ModalForm
				{...MODAL_FORM_PROPS}
				labelCol={{ flex: '65px' }}
				initialValues={isEdit ? record : {}}
				title={isEdit ? 'Edit Blogs' : 'Add Blogs'}
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

					if (isEdit) {
						res = await updateProduct({ ...params, image: uploadedImages, id: record?.id })
					} else {
						res = await addProduct({ ...params, image: uploadedImages })
						setUploadedImages([])
					}

					return afterModalformFinish(actionRef, res)
				}}
			>
				<ProFormText label="Title" name="title" rules={[{ required: true }]} />
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
									//@ts-ignore
									action: async e => {
										const isJpgOrPng = e.type === 'image/jpeg' || e.type === 'image/png'
										const isLt10M = e.size / 1024 / 1024 < 10

										if (!isJpgOrPng) {
											message.error('You can only upload JPG/PNG file!')
											return
										}

										if (!isLt10M) {
											message.error('Image must be smaller than 10MB!')
											return
										}

										setUploading(true)
										if (!!!record?.images.length) {
											setUploadedImages([])
										}

										try {
											const res = await uploadImage(e)
											setUploadedImages(state => [...state, { url: res.data?.data.url }])

											return ''
										} finally {
											setUploading(false)
										}
									}
								}}
							/>
						)}
					</div>
				</ProFormText>
			</ModalForm>
		)
	}

	const fetchData = async () => {
		const res = await getProduct({})

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
				toolBarRender={() => [renderAddEditProducts('ADD')]}
				scroll={{ x: 700 }}
			/>
		</div>
	)
}

export default Products
