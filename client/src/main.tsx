// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  // All the styles of the app will reside here.
  <div className='parser-font text-slate-600'>
    <App />
  </div>
  // </StrictMode>,
)
