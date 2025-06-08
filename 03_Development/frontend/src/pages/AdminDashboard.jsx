import React from 'react'
import AdminSidebar from '../components/adminAndManager/Sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/adminAndManager/Navbar'

const AdminDashboard = () => {
  return (
    <div className='flex min-h-screen'>
        <AdminSidebar />
        <div className='flex-1 ml-64 bg-gray-100 min-h-screen w-full'>
            <Navbar />
            <Outlet />
        </div>
    </div>
  )
}

export default AdminDashboard