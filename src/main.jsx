import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Geiger } from 'react-geiger'

import { BrowserRouter as Router } from 'react-router-dom'

import { MyStorageProvider } from './storage/StorageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Geiger renderTimeThreshold={50}>
    <MyStorageProvider>
      <Router>
        <App />
      </Router>
    </MyStorageProvider>
  </Geiger>
)
