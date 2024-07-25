import { TWebsiteItem, addWebsiteDetails, getWebsiteDetails, updateWebsiteDetails } from '@/api'
import { GLOBAL_STATUS } from '@/api/constants'
import { FORM_PROPS } from '@/constants'
import { afterModalformFinish } from '@/utils/antd'
import { ProForm, ProFormColorPicker, ProFormInstance, ProFormSwitch } from '@ant-design/pro-components'
import { Divider, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'

const Status = () => {
	const formRef = useRef<ProFormInstance>()
	const websiteFormRef = useRef<ProFormInstance>()
	const [websiteInit, setWebsiteInit] = useState<TWebsiteItem>()

	const fetchWebsiteData = async () => {
		const res = await getWebsiteDetails()

		websiteFormRef.current?.setFieldsValue(res?.data?.data ?? {})
		setWebsiteInit(res?.data?.data)
	}

	useEffect(() => {
		fetchWebsiteData()
	}, [])

	return (
		<div>
			<ProForm
				{...FORM_PROPS}
				title="Update website Status here"
				labelCol={{ flex: '130px' }}
				formRef={formRef}
				grid
				onFinish={async params => {
					let res

					if (!!!websiteInit?.id) {
						res = await addWebsiteDetails({ ...params, status: params.status ? 1 : 0 })
					} else {
						res = await updateWebsiteDetails({
							...params,
							id: websiteInit?.id,
							status: params.status ? 1 : 0
						})
					}

					fetchWebsiteData()
					return afterModalformFinish(undefined, res, websiteFormRef)
				}}
			>
				<Divider children={<Typography.Title level={5}>WEBSITE STATUS</Typography.Title>} />
				<ProFormSwitch
					label="Website Status"
					name="status"
					checkedChildren={
						<span className="font-bold" style={{ letterSpacing: '0.2rem', fontWeight: 800 }}>
							LIVE
						</span>
					}
					unCheckedChildren={
						<span className="font-bold" style={{ letterSpacing: '0.2rem', fontWeight: 800 }}>
							MAINTENANCE
						</span>
					}
					fieldProps={{ value: websiteInit?.status === GLOBAL_STATUS.ON ? true : false }}
				/>
				<Divider children={<Typography.Title level={5}>Theme</Typography.Title>} />
				<ProFormColorPicker label="Primary Color" name="primary_color" colProps={{ span: 6 }} />
				<ProFormColorPicker label="Secondary Color" name="secondary_color" colProps={{ span: 6 }} />
				<ProFormColorPicker label="Tertiary Color" name="tertiary_color" colProps={{ span: 6 }} />
				<ProFormColorPicker label="Fourth Color" name="fourth_color" colProps={{ span: 6 }} />
			</ProForm>
		</div>
	)
}

export default Status
