import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.js'
import './index.css'
import App from './App.jsx'

// Import devtools only in development
let ReactQueryDevtools = null
if (import.meta.env.DEV) {
  ReactQueryDevtools = (await import('@tanstack/react-query-devtools')).ReactQueryDevtools
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
)
