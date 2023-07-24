import React from 'react'

export default function ProgressBar() {
  return (
    <div className='relative  h-[18px] w-full overflow-hidden rounded-full bg-gray-200 bg-primaryColor/30'>
      <span className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] whitespace-nowrap text-[12px] font-bold uppercase text-white'>
        Đang bán chạy
      </span>
      <div className='h-[18px] bg-primaryColor' style={{ width: '10%' }}></div>
    </div>
  )
}
