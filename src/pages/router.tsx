import { Routes, Route } from 'react-router-dom'
import Index from '@/pages/index/index'
import Login from '@/pages/login/login'
import Register from '@/pages/register/register'
import Dashboard from '@/pages/dashboard/dashboard'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default Router