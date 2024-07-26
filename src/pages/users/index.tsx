import { addUser, getUser, updateUser } from '@/api'
import { MODAL_FORM_PROPS, PRO_TABLE_PROPS } from '@/constants'
import { TUserItem } from '@/constants/response-type'
import { dateTimeFormatter } from '@/utils'
import { afterModalformFinish } from '@/utils/antd'
import { ActionType, ModalForm, ProColumns, ProFormText, ProTable } from '@ant-design/pro-components'
import { Button, Image, Space, Typography } from 'antd'
import { useRef } from 'react'
import styles from './styles.module.scss'

const Users = () => {
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
					<div>First Name</div>
					<div>Last Name</div>
				</div>
			),
			align: 'center',
			search: false,
			render: (_, record) => (
				<div className="flex flex-col">
					<div>{record?.first_name}</div>
					<div>{record?.last_name}</div>
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
				labelCol={{ flex: '65px' }}
				initialValues={isEdit ? record : {}}
				title={isEdit ? 'Edit Blogs' : 'Add Blogs'}
				trigger={isEdit ? <Typography.Link>Edit</Typography.Link> : <Button type="primary">ADD</Button>}
				onFinish={async params => {
					let res

					if (isEdit) {
						res = await updateUser({ ...params, id: record?.id })
					} else {
						res = await addUser({ ...params })
					}

					return afterModalformFinish(actionRef, res)
				}}
			>
				<ProFormText label="Title" name="title" rules={[{ required: true }]} />
			</ModalForm>
		)
	}

	const fetchData = async () => {
		const res = await getUser({})

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
				scroll={{ x: 700 }}
			/>
		</div>
	)
}

export default Users
