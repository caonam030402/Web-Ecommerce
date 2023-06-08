import React from 'react'
import { TfiLocationPin } from 'react-icons/tfi'
import Button from 'src/components/Button'

export default function Payment() {
  return (
    <div className='container mt-4'>
      <div className='bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-1 text-primaryColor'>
          <TfiLocationPin className='text-xl' />
          <span className='text-[17px]'>Địa Chỉ Nhận Hàng</span>
        </div>
        <div className='mt-3 text-[15px]'>
          <span className='mr-3 font-bold'>CaoNam</span>
          <span>Cẩm Lệ, Đà Nẵng</span>
          <button className='ml-4 text-blue-500'>Thay đổi</button>
        </div>
      </div>
      <div className='mt-3 rounded-sm bg-white p-6 shadow-sm'>
        <table className='text-sx w-full text-center'>
          <thead>
            <tr className=' text-gray-400'>
              <th className='text-left text-lg font-normal text-gray-800'>Sản phẩm</th>
              <th className='font-normal'>Đơn giá</th>
              <th className='font-normal'>Số lượng</th>
              <th className='text-right font-normal'>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr className='text-center'>
              <td className='max-w-[300px] pb-0 pt-6'>
                <div className='flex items-center gap-3'>
                  <img
                    className='h-14 w-14 border'
                    src=' https://api-ecom.duthanhduoc.com/images/51ef469d-0eb5-48fb-958d-ce2b9c664adc.jpg'
                    alt=''
                  />
                  <span className='truncate'>
                    Sansmug S21 Điện thoại giá rẻ Điện thoại di động Bán (16GB/1TB) Thương hiệu mới 5G WiFi Smartphone
                    zalo google
                  </span>
                </div>
              </td>
              <td className='pb-0 pt-6'>200.000đ</td>
              <td className='pb-0 pt-6'>1</td>
              <td className='pb-0 pt-6 text-right'>300.000đ</td>
            </tr>
            <tr className='text-center'>
              <td className='max-w-[300px] pb-0 pt-6'>
                <div className='flex items-center gap-3'>
                  <img
                    className='h-14 w-14 border'
                    src=' https://api-ecom.duthanhduoc.com/images/51ef469d-0eb5-48fb-958d-ce2b9c664adc.jpg'
                    alt=''
                  />
                  <span className='truncate'>
                    Sansmug S21 Điện thoại giá rẻ Điện thoại di động Bán (16GB/1TB) Thương hiệu mới 5G WiFi Smartphone
                    zalo google
                  </span>
                </div>
              </td>
              <td className='pb-0 pt-6'>200.000đ</td>
              <td className='pb-0 pt-6'>1</td>
              <td className='pb-0 pt-6 text-right'>300.000đ</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='relative mt-3 bg-white p-6 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div className='text-lg font-normal text-gray-800'>Phương thức thanh toán</div>
          <div>
            <span className='mr-16'>Thanh toán khi nhận hàng</span>
            <span className='text-blue-600'>THAY ĐỔI</span>
          </div>
        </div>
        <div className=' mt-10 flex items-end justify-between'>
          <div>
            Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo{' '}
            <span className='text-blue-600'>Điều khoản Shopee</span>
          </div>
          <div className='flex flex-col items-end'>
            <div>
              Tổng thanh toán: <span className='ml-4 text-2xl text-primaryColor'>đ1999.000</span>
            </div>
            <Button className='mt-4 flex w-[180px] items-center justify-center rounded-sm bg-primaryColor py-[10px] text-sm text-white'>
              Đặt hàng
            </Button>
          </div>
        </div>
        <div className='absolute top-[35%] right-0 h-[1px] w-full bg-gray-200'></div>
      </div>
    </div>
  )
}
