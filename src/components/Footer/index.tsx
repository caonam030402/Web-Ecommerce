import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    // my-10 border-t-4 border-primaryColor
    <footer className='my-10'>
      <div className='x mx-auto mt-9 px-3 text-gray-500 lg:max-w-7xl lg:px-0 lg:text-left'>
        <div className=' grid grid-cols-1 text-center text-sm lg:grid-cols-3 lg:text-left'>
          <p className='lg:col-span-1'>© 2023 CaoNam. Tất cả các quyền được bảo lưu.</p>
          <p className=' lg:col-span-2 '>
            Quốc gia & Khu vực: Singapore | Indonesia | Đài Loan | Thái Lan | Malaysia | Việt Nam | Philippines | Brazil
            | México | Colombia | Chile
          </p>
        </div>
        <div className='mt-12 hidden text-center lg:block'>
          <Link
            to=''
            className='relative px-4 after:absolute after:right-0 after:top-[50%] after:h-4 after:w-[0.25px] after:translate-y-[-50%] after:bg-gray-400'
          >
            CHÍNH SÁCH BẢO MẬT
          </Link>
          <Link
            to=''
            className='relative px-4 after:absolute after:right-0 after:top-[50%] after:h-4 after:w-[0.25px] after:translate-y-[-50%] after:bg-gray-400'
          >
            QUY CHẾ HOẠT ĐỘNG
          </Link>
          <Link
            to=''
            className='relative px-4 after:absolute after:right-0 after:top-[50%] after:h-4 after:w-[0.25px] after:translate-y-[-50%] after:bg-gray-400'
          >
            CHÍNH SÁCH VẬN CHUYỂN
          </Link>
          <Link to='' className='px-4'>
            CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN
          </Link>
        </div>
        <div className='mt-12 text-center text-xs'>
          <p className='mb-1'>
            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành
            phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn
          </p>
          <p className='mb-1'>
            Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)
          </p>
          <p className='mb-1'>
            Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015
          </p>
          <p className='mb-1'>© 2015 - Bản quyền thuộc quyền sở hữu của Cao Nam</p>
        </div>
      </div>
    </footer>
  )
}
