// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//env
import { getEnv } from './config/env';

// google login
import { GoogleOAuthProvider } from '@react-oauth/google';

// CSS
import './index.css'

// Components
import App from './App.tsx'

// Redux
import { Provider } from 'react-redux'
import { store } from './Redux/store.ts'

// router
import { BrowserRouter } from 'react-router-dom'

// Context
import { ModalAuthProvider } from './Features/Authentication/component/ModalAuthContext.tsx';

const { googleClientId } = getEnv();

// set theme
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.classList.toggle('dark', savedTheme === 'dark')


createRoot(document.getElementById('root')!).render(
  
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <BrowserRouter>
          <ModalAuthProvider>
            <App />
          </ModalAuthProvider>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  ,
)
