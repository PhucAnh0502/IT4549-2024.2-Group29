import React from 'react'
import { Outlet } from 'react-router-dom'
import TrainerNavbar from '../components/trainerDashboard/TrainerNavbar'
import TrainerSidebar from '../components/trainerDashboard/TrainerSidebar'

const TrainerDashboard = () => {
  return (
    <div className='flex min-h-screen'>
        <TrainerSidebar />
        <div className='flex-1 ml-64 bg-gray-100 min-h-full w-full'>
            <TrainerNavbar />
            <Outlet />
        </div>
    </div>
  )
}

export default TrainerDashboard