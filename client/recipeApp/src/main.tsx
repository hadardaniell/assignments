import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './themes';
import { ConfigProvider } from './context/config.context.tsx';
import { CacheProvider } from '@emotion/react';
import { cacheRtl } from './rtl-cache.ts';
import { initHttpClient } from './services/http-client.service.ts';

async function bootstrap() {
  await initHttpClient();
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
  );
}

bootstrap();
