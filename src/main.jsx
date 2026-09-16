import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
/** Global styles; Montserrat loaded in `index.html`, stack on `body` here + MUI theme in `App.jsx` */
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
