import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './services/store/store.ts'
// import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomToast from './components/ui/CustomToast.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>

    <App />
     <CustomToast />
    </Provider>
  </StrictMode>,
)
