import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/adminAndManager/Navbar'
import AdminSidebar from '../components/adminAndManager/Sidebar'

const AdminDashboard = () => {
  return (
    <div className='flex min-h-screen'>
        <AdminSidebar />
        <div className='flex-1 ml-64 bg-gray-100 min-h-full w-full'>
            <Navbar />
            <Outlet />
        </div>
    </div>
  )
}

export default AdminDashboard