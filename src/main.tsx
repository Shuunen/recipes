/* v8 ignore start -- @preserve */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './styles.css'
import { App } from './app/app'

registerSW({ immediate: true })

const rootElement = document.querySelector('#root')
if (rootElement === null) throw new Error('Root element not found')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
