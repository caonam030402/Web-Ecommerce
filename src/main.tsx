import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './Contexts/app.contexts'
import './index.css'
import ErrorBoundary from './components/ErrorBoudary'
import 'src/i18n/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable retrieving data every time the window is displayed.
      retry: 0
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
