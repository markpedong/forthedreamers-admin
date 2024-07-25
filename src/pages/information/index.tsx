import { TDetailsItem, addDetails, getDetails, updateDetails, uploadImage } from '@/api'
import { GLOBAL_STATUS } from '@/api/constants'
import { FORM_PROPS, INPUT_EMAIL } from '@/constants'
import { INPUT_TRIM } from '@/utils'
import { afterModalformFinish } from '@/utils/antd'
import {
	ProForm,
	ProFormInstance,
	ProFormSwitch,
	ProFormText,
	ProFormTextArea,
	ProFormUploadButton
} from '@ant-design/pro-components'
import { Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'

const Information = () => {
	const formRef = useRef<ProFormInstance>()
	const [init, setInit] = useState<TDetailsItem>()
	const [pdfUrl, setPdfUrl] = useState('')
	const [docxUrl, setDocxUrl] = useState('')

	const fetchData = async () => {
		const res = await getDetails()

		formRef.current?.setFieldsValue(res?.data?.data ?? {})
		setInit(res?.data?.data)
	}

	const splitUrl = (url: string) => url.split('/').pop()!

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<div>
			<Typography.Title level={5}>Update the main details of the website: </Typography.Title>
			<ProForm
				{...FORM_PROPS}
				labelCol={{ flex: '120px' }}
				formRef={formRef}
				grid
				onFinish={async params => {
					let res

					if (!!!init?.id) {
						res = await addDetails(params)
					} else {
						res = await updateDetails({
							...params,
							id: init?.id,
							resume_pdf: !!!pdfUrl ? init?.resume_pdf : pdfUrl,
							resume_docx: !!!docxUrl ? init?.resume_docx : docxUrl,
							isResumeDownloadable: params.isResumeDownloadable ? 1 : 0
						})
					}

					fetchData()
					return afterModalformFinish(undefined, res, formRef)
				}}
			>
				<ProFormText
					{...INPUT_TRIM}
					rules={[{ required: true }]}
					label="First Name"
					name="first_name"
					colProps={{ span: 12 }}
				/>
				<ProFormText
					{...INPUT_TRIM}
					rules={[{ required: true }]}
					label="Last Name"
					name="last_name"
					colProps={{ span: 12 }}
				/>
				<ProFormText {...INPUT_TRIM} rules={[{ required: true }]} label="Phone" name="phone" colProps={{ span: 12 }} />
				<ProFormText
					{...INPUT_TRIM}
					rules={[INPUT_EMAIL, { required: true }]}
					label="Email"
					name="email"
					colProps={{ span: 12 }}
				/>
				<ProFormTextArea rules={[{ required: true }]} label="Address" name="address" />
				<ProFormTextArea rules={[{ required: true }]} label="Description" name="description" />
				<ProFormSwitch
					label="Resumé"
					name="isResumeDownloadable"
					checkedChildren={
						<span className="font-bold" style={{ letterSpacing: '0.2rem', fontWeight: 800 }}>
							ENABLED
						</span>
					}
					unCheckedChildren={
						<span className="font-bold" style={{ letterSpacing: '0.2rem', fontWeight: 800 }}>
							DISABLED
						</span>
					}
					fieldProps={{ value: init?.isResumeDownloadable === GLOBAL_STATUS.ON ? true : false }}
				/>
				<ProFormUploadButton
					label="Resumé PDF"
					name="resume_pdf"
					colProps={{ span: 12 }}
					rules={[{ required: true }]}
					fieldProps={{
						accept: '.pdf',
						listType: 'text',
						fileList:
							pdfUrl || init?.resume_pdf
								? [
										{
											uid: '-1',
											name: splitUrl(pdfUrl) || splitUrl(init?.resume_pdf!),
											status: 'done',
											url: pdfUrl,
											type: 'pdf'
										}
									]
								: [],
						multiple: false,
						maxCount: 1,
						customRequest: async e => {
							setPdfUrl('')

							const res = await uploadImage(e?.file)
							if (res.data.success) {
								setPdfUrl(res.data.data.url)
							} else {
								console.error('Failed to upload PDF or retrieve URL.')
							}
						},
						onRemove: () => setPdfUrl('')
					}}
				/>
				<ProFormUploadButton
					label="Resumé DOCX"
					name="resume_docx"
					colProps={{ span: 12 }}
					rules={[{ required: true }]}
					fieldProps={{
						accept: '.docx',
						listType: 'text',
						fileList:
							docxUrl || init?.resume_docx
								? [
										{
											uid: '-1',
											name: splitUrl(docxUrl) || splitUrl(init?.resume_docx!),
											status: 'done',
											url: docxUrl,
											type: 'docx'
										}
									]
								: [],
						multiple: false,
						maxCount: 1,
						customRequest: async e => {
							setDocxUrl('')

							const res = await uploadImage(e?.file)
							if (res.data.success) {
								setDocxUrl(res.data.data.url)
							} else {
								console.error('Failed to upload DOCX or retrieve URL.')
							}
						},
						onRemove: () => setDocxUrl('')
					}}
				/>
			</ProForm>
		</div>
	)
}

export default Information
