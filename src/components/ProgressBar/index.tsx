import React from 'react'

export default function ProgressBar() {
  return (
    <div className='relative h-[14px] w-full overflow-hidden rounded-full bg-gray-200 bg-primaryColor/30 md:h-[18px]'>
      <span className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] whitespace-nowrap text-[7px] uppercase text-white md:text-[12px] md:font-bold'>
        Đang bán chạy
      </span>
      <div className='h-[18px] bg-primaryColor' style={{ width: '10%' }}></div>
    </div>
  )
}
