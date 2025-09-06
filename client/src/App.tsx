import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthForm, AuthLayout, ForgotPassword, Home, NotFound, ResetPassword, Signin, Signup } from './pages'
import './App.css'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/auth" element={<AuthLayout />}>

          <Route path="sign-in"
            element={<AuthForm
              className='fill-indigo-500!'
              title='Welcome Back👋🏻'
              description="We're happy to see you again! Sign in to continue.">
              <Signin />
            </AuthForm>} />

          <Route path="sign-up"
            element={<AuthForm className='fill-pink-500!'
              title='Join Parser Today 🚀'
              description="Create an account and get started with your journey!">
              <Signup />
            </AuthForm>} />

          <Route path="forgot-password"
            element={<AuthForm
              className='fill-orange-500!'
              title='Forgot Your Password? 🤔'
              description="No worries — we’ll help you reset it in a few steps."
            >
              <ForgotPassword />
            </AuthForm>}
          />
          <Route path="reset-password/:reset_id"
            element={<AuthForm
              className='fill-fuchsia-500!'
              title='Reset Your Password 🔐'
              description='Enter a new password to secure your account.'>
              <ResetPassword />
            </AuthForm>} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
