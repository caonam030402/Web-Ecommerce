import React from 'react'
import { Link } from 'react-router-dom'
import cart from 'src/assets/image/no-cart.png'
import { path } from 'src/constants/path'

export default function PaymentReturn() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center'>
        <img className='mx-auto w-80' src={cart} alt='' />
        <h1 className='text-2xl text-primaryColor '>Thanh Toán Thành Công</h1>
        <Link
          to={path.home}
          className='mt-4 flex w-[180px] items-center justify-center rounded-sm bg-primaryColor py-[10px] text-sm text-white'
        >
          Quay Về Trang Chủ
        </Link>
      </div>
    </div>
  )
}
