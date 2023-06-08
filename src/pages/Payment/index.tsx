import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Address, District, Ward } from 'src/types/address.type'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TfiLocationPin } from 'react-icons/tfi'
import { addressApi } from 'src/apis/address.api'
import Button from 'src/components/Button'
import { AppContext } from 'src/components/Contexts/app.contexts'
import Input from 'src/components/Input'
import { useOnClickOutside } from 'usehooks-ts'

export default function Payment() {
  const [isOpenSeclect, setIsOpenSelect] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [addressCity, setAddressCity] = useState<Address>()
  const [addressDistrict, setAddressDistrict] = useState<District>()

  const [addressValue, setAddressValue] = useState({
    city: '',
    district: '',
    ward: ''
  })

  // const isActive = (type: 'city' | 'district' | 'ward') => {
  //   if (!addressCity && type === 'city') {
  //     return true
  //   } else if (!addressCity && addressDistrict) {
  //     return true
  //   }
  // }

  const myElementRef = useRef<HTMLDivElement>(null)

  const { data: addressData } = useQuery({
    queryKey: ['address'],
    queryFn: addressApi.getAddress
  })

  const handleOpenSelect = () => {
    setIsOpenSelect(true)
  }

  const handleCloseSelect = () => {
    setIsOpenSelect(false)
  }

  const handleOpenModal = () => {
    isOpenModal ? setIsOpenModal(false) : setIsOpenModal(true)
  }

  const handlePickAddress = (item: Address | District | Ward, type: 'city' | 'district' | 'ward') => {
    if (type === 'city') {
      setAddressCity(item as Address)
      setAddressValue((prev) => ({ ...prev, city: item.Name }))
    } else if (type === 'district') {
      setAddressDistrict(item as District)
      setAddressValue((prev) => ({ ...prev, district: item.Name }))
    } else {
      setAddressValue((prev) => ({ ...prev, ward: item.Name }))
    }
  }

  const valueAddress = `${addressValue.city}${addressValue.district && ','} ${addressValue.district}${
    addressValue.ward && ','
  } ${addressValue.ward}`

  useOnClickOutside(myElementRef, handleCloseSelect)

  const { profile } = useContext(AppContext)
  return (
    <div className='container mt-4'>
      <div className='bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-1 text-primaryColor'>
          <TfiLocationPin className='text-xl' />
          <span className='text-[17px]'>Địa Chỉ Nhận Hàng</span>
        </div>
        <div className='mt-3 text-[15px]'>
          <span className='mr-3 font-bold'>CaoNam</span>
          <span>{profile?.address}</span>
          <button onClick={handleOpenModal} className='ml-4 text-blue-500'>
            Thay đổi
          </button>
        </div>
        {isOpenModal && (
          <div className='fixed inset-0 z-50'>
            <div className='absolute right-[50%] top-[50%] w-[550px] translate-x-[50%] translate-y-[-50%] rounded-sm bg-white p-6 text-left'>
              <h1 className='text-[20px]'>Địa chỉ mới</h1>
              <div className='mt-6'>
                <div ref={myElementRef} className='relative w-full'>
                  <Input
                    onChange={() => null}
                    value={valueAddress || ''}
                    onClick={handleOpenSelect}
                    placeholder='Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã'
                  ></Input>
                  {isOpenSeclect && (
                    <div className='absolute top-[80%] w-full border bg-white shadow-sm'>
                      <div className='grid grid-cols-3 text-center'>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': !addressValue.city
                          })}
                        >
                          Tỉnh/Thành phố
                        </div>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': addressValue.city !== '' && !addressDistrict
                          })}
                        >
                          Quận/Huyện
                        </div>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor':
                              addressValue.city !== '' && addressValue.district !== ''
                          })}
                        >
                          Phường/Xã
                        </div>
                      </div>
                      <div className='h-[140px] overflow-auto border-t'>
                        {!addressCity &&
                          addressData?.data.data.map((item, index) => {
                            return (
                              <button
                                onClick={() => handlePickAddress(item, 'city')}
                                className='w-full p-3 text-left hover:bg-gray-100'
                                key={index}
                              >
                                {item.Name}
                              </button>
                            )
                          })}
                        {addressValue.city !== '' &&
                          !addressDistrict &&
                          addressCity?.Districts.map((item, index) => {
                            return (
                              <button
                                onClick={() => handlePickAddress(item, 'district')}
                                className='w-full p-3 text-left hover:bg-gray-100'
                                key={index}
                              >
                                {item.Name}
                              </button>
                            )
                          })}
                        {addressValue.city !== '' &&
                          addressValue.district !== '' &&
                          addressDistrict?.Wards.map((item, index) => {
                            console.log(item.Name)
                            return (
                              <button
                                onClick={() => handlePickAddress(item, 'ward')}
                                className='w-full p-3 text-left hover:bg-gray-100'
                                key={index}
                              >
                                {item.Name}
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
                <Input placeholder='Họ và tên'></Input>
                <Input placeholder='Số điện thoại'></Input>
              </div>
              {/* <div className='mt-6 flex gap-3'>
              <div className='relative'>
                <Input placeholder='Tỉnh thành' />
                <div className='absolute top-[60%] h-[180px] w-full overflow-auto border bg-white shadow-sm'>
                  {addressData?.data.data.map((item, index) => (
                    <div className='p-3 hover:bg-gray-100' key={index}>
                      {item.Name}
                    </div>
                  ))}
                </div>
              </div>
              <div className='relative'>
                <Input placeholder='Huyện' />
                <div className='absolute top-[60%] h-[180px] w-full overflow-auto border bg-white shadow-sm'>
                  {addressData?.data.data.map((item, index) =>
                    item.Districts.map((item, index) => (
                      <div className='p-3 hover:bg-gray-100' key={index}>
                        {item.Name}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className='relative'>
                <Input placeholder='Phường xã' />
                <div className='absolute top-[60%] h-[180px] w-full overflow-auto border bg-white shadow-sm'>
                  {addressData?.data.data.map((item) =>
                    item.Districts.map((item) =>
                      item.Wards.map((item, index) => (
                        <div className='p-3 hover:bg-gray-100' key={index}>
                          {item.Name}
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </div> */}
              <div className='mt-7 flex justify-end gap-3'>
                <Button
                  onClick={handleOpenModal}
                  className='flex w-[150px] items-center justify-center rounded-sm border py-[8px] text-sm '
                >
                  Hủy
                </Button>
                <Button className='flex w-[150px] items-center justify-center rounded-sm bg-primaryColor py-[8px] text-sm text-white hover:bg-primaryColor/80'>
                  Hoàn Thành
                </Button>
              </div>
            </div>
            <button onClick={handleOpenModal} className='h-full w-full bg-black/50'></button>
          </div>
        )}
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
