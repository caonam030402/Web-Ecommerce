import React from 'react'
import UserSideNav from '../../components/UserSideNav'
import { Outlet } from 'react-router-dom'

export default function UserLayout() {
  return (
    <div>
      <div className='container my-6'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='col-span-2'>
            <UserSideNav />
          </div>
          <div className='col-span-10'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
