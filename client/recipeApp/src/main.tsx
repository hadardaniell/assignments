import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles'
import { cacheRtl, theme } from './themes'
import { ConfigProvider } from './context/config.context.tsx'
import { CacheProvider } from '@emotion/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>
)