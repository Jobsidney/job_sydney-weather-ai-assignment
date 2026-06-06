import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppErrorBoundary } from '@/components/shared/AppErrorBoundary'
import { QueryProvider } from '@/providers/query-provider'
import App from '@/App'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <QueryProvider>
        <App />
      </QueryProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
