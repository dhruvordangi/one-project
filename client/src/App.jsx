import { useState } from 'react'
import { UserContextProvider } from './UserContext.jsx'
import { Routes,Route } from 'react-router-dom'

import './App.css'
import Layout from './Layout/Layout.jsx'
import IndexPage from './Pages/IndexPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import RegisterPage from './Pages/RegisterPage.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import AssignmentForm from './Pages/AssingmentForm.jsx'

function App() {
  

  return (
    <UserContextProvider>
      <Auth0Provider domain="dev-fxq6htveh1ff7e2k.us.auth0.com"
      clientId="FMmN7xBn3hWyXb4Pbn9Jl4zXkRPkMCnd"
      authorizationParams={
        {
          redirect_uri: window.location.origin
        }
      }
      >
      <Routes>
        <Route path='/' element={<Layout/>} >
          <Route index element={<IndexPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/create-assignment' element={<AssignmentForm/>} />
        </Route>
      </Routes>
      </Auth0Provider>
    </UserContextProvider>
  )
}

export default App
