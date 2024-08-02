import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Root from '@/pages/root'
import '@/styles/global.scss'
import ReduxProvider from './redux/provider'
import { ignoreFindDOMNodeError } from './utils'
import { AntdConfigProvider } from './utils/antd'

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
