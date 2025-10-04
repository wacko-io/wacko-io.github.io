import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntApp, theme } from 'antd'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    borderRadius: 18,
                    padding: 16,
                    margin: 16
                },
            }}
        >
            <AntApp>
                <App />
            </AntApp>
        </ConfigProvider>
    </React.StrictMode>
)
