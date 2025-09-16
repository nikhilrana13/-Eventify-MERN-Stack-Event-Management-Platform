import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/es/integration/react'
import { store, persistor } from './Redux/Store.jsx'
import SmoothScrollWrapper from './Components/PageComponent/SmoothScrollWrapper'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}   >
            <BrowserRouter>
                <SmoothScrollWrapper>
                    {(lenis)=> <App lenis={lenis} />}
                </SmoothScrollWrapper>
            </BrowserRouter>
        </PersistGate>
    </Provider>

)
