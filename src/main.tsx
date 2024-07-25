import Root from '@/pages/root'
import '@/styles/global.scss'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReduxProvider from './redux/provider'
import { AntdConfigProvider } from './utils/antd'
import { ignoreFindDOMNodeError } from './utils'

ignoreFindDOMNodeError()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<ReduxProvider>
				<AntdConfigProvider>
					<Root />
				</AntdConfigProvider>
			</ReduxProvider>
		</BrowserRouter>
	</React.StrictMode>
)
