import { Routes, Route } from 'react-router-dom'
import Index from '@/pages/index/index'
import Login from '@/pages/login/login'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  )
}

export default Router