import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound, AuthLayout } from './pages'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<p className='text-amber-300'>Home page</p>} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="sign-in" element={<p>Sign-In</p>} />
          <Route path="sign-up" element={<p>Sign-up</p>} />
          <Route path="forgot-password" element={<p>Forgot-password</p>} />
          <Route path="reset-password/:reset_id" element={<p>Reset password</p>} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
