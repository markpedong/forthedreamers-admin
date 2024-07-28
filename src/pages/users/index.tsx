import { addUser, getUsers, updateUser, uploadImage } from '@/api'
import { MODAL_FORM_PROPS, PRO_TABLE_PROPS } from '@/constants'
import { TUserItem } from '@/constants/response-type'
import { dateTimeFormatter } from '@/utils'
import { afterModalformFinish } from '@/utils/antd'
import {
	ActionType,
	ModalForm,
	ProColumns,
	ProFormText,
	ProFormTextArea,
	ProFormUploadButton,
	ProTable
} from '@ant-design/pro-components'
import { Button, Image, Space, Spin, Typography, UploadFile } from 'antd'
import { useRef, useState } from 'react'
import styles from './styles.module.scss'
import { RcFile } from 'antd/es/upload'
import { validateImg } from '@/constants/helper'

const Users = () => {
	const [uploadedImg, setUploadedImg] = useState('')
	const [uploading, setUploading] = useState(false)
	const actionRef = useRef<ActionType>()

	const columns: ProColumns<TUserItem>[] = [
		{
			title: 'Image',
			align: 'center',
			search: false,
			render: (_, record) => {
				return (
					<div className={styles.imgContainer}>
						<Image src={record?.image} />
					</div>
				)
			}
		},
		{
			title: 'Username',
			align: 'center',
			dataIndex: 'username',
			search: false
		},
		{
			title: 'Password',
			align: 'center',
			dataIndex: 'password',
			search: false
		},
		{
			title: (
				<div className="flex flex-col gap-0">
					<span className='leading-4'>First Name</span>
					<span className='leading-4'>Last Name</span>
				</div>
			),
			align: 'center',
			search: false,
			width: 100,
			render: (_, record) => (
				<div className="flex flex-col gap-0">
					<span className='leading-4'>{record?.first_name}</span>
					<span className='leading-4'>{record?.last_name}</span>
				</div>
			)
		},
		{
			title: 'Phone',
			align: 'center',
			dataIndex: 'phone'
		},
		{
			title: 'Address',
			align: 'center',
			dataIndex: 'address',
			search: false
		},
		{
			title: 'Email',
			align: 'center',
			dataIndex: 'email'
		},

		{
			title: (
				<div className="flex flex-col gap-0">
					<span className='leading-4'>Created</span>
					<span className='leading-4'>Updated</span>
				</div>
			),
			search: false,
			align: 'center',
			width: 160,
			render: (_, record) => (
				<div className="flex flex-col">
					<span className='leading-4'>{dateTimeFormatter(record.created_at, 'MM-DD-YYYY HH:MM:ss')}</span>
					<span className='leading-4'>{dateTimeFormatter(record.updated_at, 'MM-DD-YYYY HH:MM:ss')}</span>
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
					{renderAddUsers('EDIT', record)}
					{/* {renderDeleteBlogs(record)} */}
				</Space>
			)
		}
	]

	const renderAddUsers = (type: 'ADD' | 'EDIT', record?: TUserItem) => {
		const isEdit = type === 'EDIT'
		return (
			<ModalForm
				{...MODAL_FORM_PROPS}
				width={1000}
				labelCol={{ flex: '100px' }}
				initialValues={isEdit ? record : {}}
				title={isEdit ? 'Edit User' : 'Add User'}
				grid
				trigger={
					isEdit ? (
						<Typography.Link onClick={() => setUploadedImg(record?.image!)}>Edit</Typography.Link>
					) : (
						<Button type="primary">ADD</Button>
					)
				}
				onFinish={async params => {
					let res

					if (isEdit) {
						res = await updateUser({ ...params, image: uploadedImg, id: record?.id })
					} else {
						res = await addUser({ ...params, image: uploadedImg })
					}

					return afterModalformFinish(actionRef, res)
				}}
				onOpenChange={visible => !visible && setUploadedImg('')}
			>
				<ProFormText
					colProps={{ span: 12 }}
					label="First Name"
					name="first_name"
					rules={[{ required: true }]}
				/>
				<ProFormText colProps={{ span: 12 }} label="Last Name" name="last_name" rules={[{ required: true }]} />
				<ProFormText colProps={{ span: 12 }} label="Phone" name="phone" rules={[{ required: true }]} />
				<ProFormText colProps={{ span: 12 }} label="Email" name="email" rules={[{ required: true }]} />
				<ProFormText colProps={{ span: 12 }} label="Username" name="username" rules={[{ required: true }]} />
				<ProFormText.Password
					colProps={{ span: 12 }}
					label="Password"
					name="password"
					rules={[{ required: true }]}
				/>
				<ProFormTextArea colProps={{ span: 12 }} label="Address" name="address" rules={[{ required: true }]} />
				<ProFormText colProps={{ span: 12 }} label="Image" rules={[{ required: true }]}>
					<div>
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
									multiple: false,
									onRemove: () => setUploadedImg(''),
									fileList: uploadedImg ? ([{ url: uploadedImg }] as UploadFile<any>[]) : [],
									action: async (e: RcFile) => {
										if (validateImg(e) === '') return ''

										setUploading(true)
										if (!record?.image) {
											setUploadedImg('')
										}

										try {
											const res = await uploadImage(e)
											setUploadedImg(res.data?.data.url)

											return res.data?.data.url || ''
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
		const res = await getUsers({})

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
				toolBarRender={() => [renderAddUsers('ADD')]}
				scroll={{ x: 1200 }}
			/>
		</div>
	)
}

export default Users
