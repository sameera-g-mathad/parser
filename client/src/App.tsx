import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  // Homepage
  Home,
  // Auth related Components
  AuthForm, AuthLayout, ForgotPassword, ResetPassword, Signin, Signup, VerifySignup,

  // App related Components
  Dashboard,
  // Not found Component
  NotFound
} from './pages'
import './App.css'

/**
 * 
 * @returns The JSX Element that is the start of this application.
 */
function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route index path="/" element={<Home />} />

        {/* Common Layout for the nested components. */}
        <Route path="/auth" element={<AuthLayout />}>

          {/* SignIn route */}
          <Route path="sign-in"
            element={
              <AuthForm
                className='fill-indigo-500!'
                title='Welcome Back👋🏻'
                description="We're happy to see you again! Sign in to continue.">
                <Signin />
              </AuthForm>
            }
          />
          {/* SignUp route */}
          <Route path="sign-up"
            element={
              <AuthForm className='fill-pink-500!'
                title='Join Parser Today 🚀'
                description="Create an account and get started with your journey!">
                <Signup />
              </AuthForm>
            }
          />
          {/* ForgotPassword route */}
          <Route path="forgot-password"
            element=
            {
              <AuthForm
                className='fill-orange-500!'
                title='Forgot Your Password? 🤔'
                description="No worries — we’ll help you reset it in a few steps."
              >
                <ForgotPassword />
              </AuthForm>
            }
          />

          {/* Resetpassword route */}
          <Route path="reset-password/:reset_id"
            element={
              <AuthForm
                className='fill-fuchsia-500!'
                title='Reset Your Password 🔐'
                description='Enter a new password to secure your account.'>
                <ResetPassword />
              </AuthForm>
            }
          />

          {/* VerifyAndCreateUser route*/}
          <Route path="verify-user/:verify_id"
            element={
              <AuthForm
                className='fill-teal-500!'
                title='Account Verification'
                description='We are verifying your account. You’ll be redirected shortly.'>
                <VerifySignup />
              </AuthForm>
            }
          />
        </Route>

        <Route path="/app/dashboard" element={<Dashboard />} />

        {/* NotFound route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
