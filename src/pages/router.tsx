import { Routes, Route } from 'react-router-dom'
import Index from '@/pages/index/index'
import Login from '@/pages/login/login'
import Register from '@/pages/register/register'
import {Dashboard} from '@/pages/dashboard/dashboard'
import Layout from '@/components/Layout'
import Course from './course/course'
import { Students } from './course/students'
import Attendance from './course/attendance'
import { CourseCreate } from './course/course-create'
import AttendanceUpload from './course/attendance-upload'
import AttendanceView from './course/attendance-view'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/:university" element={<Layout />}>
          <Route index element={<Dashboard />} />
           <Route path=":courseId" element={<Course />} />
           <Route path=":courseId/students" element={<Students />} />
           <Route path=":courseId/attendance" element={<Attendance />} />
           <Route path=":courseId/attendance/upload" element={<AttendanceUpload />} />
           <Route path=":courseId/attendance/:attendanceId" element={<AttendanceView />} />
           <Route path="create" element={<CourseCreate />} />
      </Route>
      {/* <Route path="/courses/:courseId" element={<Layout />}>
          <Route index element={<Course />} />
      </Route> */}
    </Routes>
  )
}

export default Router