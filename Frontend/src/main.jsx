import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 

import './index.css'
import App from './App.jsx'
import { store } from './redux/store/store.js'
import { ContextProvider } from './context/context.jsx';

//instance of react query
const client = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ContextProvider>
        <App />

        </ContextProvider>
        
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
