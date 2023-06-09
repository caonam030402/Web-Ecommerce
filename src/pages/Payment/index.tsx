import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Address, District, Ward } from 'src/types/address.type'
import React, { useContext, useMemo, useRef, useState } from 'react'
import { TfiLocationPin } from 'react-icons/tfi'
import { addressApi } from 'src/apis/address.api'
import Button from 'src/components/Button'
import { AppContext } from 'src/components/Contexts/app.contexts'
import Input from 'src/components/Input'
import { useOnClickOutside } from 'usehooks-ts'
import { formatCurrency } from 'src/utils/utils'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { purchaseApi } from 'src/apis/purchase.api'
import { path } from 'src/constants/path'

export default function Payment() {
  const [isOpenSeclect, setIsOpenSelect] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [addressCity, setAddressCity] = useState<Address>()
  const [addressDistrict, setAddressDistrict] = useState<District>()
  const { setPurchasePayment, purchasePayment } = useContext(AppContext)
  const [isOpenMethodPayment, setIsOpenMethodPayment] = useState(false)

  const [addressValue, setAddressValue] = useState({
    city: '',
    district: '',
    ward: ''
  })

  const navigate = useNavigate()

  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      toast.success(data.data.message, { autoClose: 1000 })
    }
  })

  const handleOpenMethodPayment = () => {
    setIsOpenMethodPayment(true)
  }

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
  const totalCheckedPurchasePrice = useMemo(
    () =>
      purchasePayment.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [purchasePayment]
  )

  const valueAddress = `${addressValue.city}${addressValue.district && ','} ${addressValue.district}${
    addressValue.ward && ','
  } ${addressValue.ward}`

  useOnClickOutside(myElementRef, handleCloseSelect)

  const handleBuyPurchases = () => {
    if (profile?.address === undefined) {
      toast.error('Vui lòng điền địa chỉ trước khi mua')
    } else {
      if (purchasePayment.length > 0) {
        const body = purchasePayment.map((purchase) => ({
          purchase_id: purchase._id
        }))
        navigate(`${path.historyPurchase}/?status=1`)
        buyPurchaseMutation.mutate(body)
      }
    }
  }

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
            {purchasePayment.map((purchase, index) => (
              <tr key={index} className='text-center'>
                <td className='max-w-[300px] pb-0 pt-6'>
                  <div className='flex items-center gap-3'>
                    <img className='h-14 w-14 border' src={purchase.product.image} alt='' />
                    <span className='truncate'>{purchase.product.name}</span>
                  </div>
                </td>
                <td className='pb-0 pt-6'>₫{formatCurrency(purchase.price)}</td>
                <td className='pb-0 pt-6'>{formatCurrency(purchase.buy_count)}</td>
                <td className='pb-0 pt-6 text-right'>₫{formatCurrency(purchase.buy_count * purchase.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='relative mt-3 bg-white p-6 shadow-sm'>
        {!isOpenMethodPayment ? (
          <div className='flex items-center justify-between'>
            <div className='text-lg font-normal text-gray-800'>Phương thức thanh toán</div>
            <div>
              <span className='mr-16'>Thanh toán khi nhận hàng</span>
              <button onClick={handleOpenMethodPayment} className='text-blue-600'>
                THAY ĐỔI
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className='mt-3 flex items-center gap-5'>
              <h1 className='text-lg'>Phương thức thanh toán</h1>
              <div>
                <button className='mr-3 border-[1px] border-primaryColor px-3 py-2 text-primaryColor'>
                  Thanh toán khi nhận hàng
                </button>
                <button className='border-[2px] px-3 py-2'>Thanh toán ví Momo</button>
              </div>
            </div>
          </div>
        )}
        <div className=' mt-10 flex items-end justify-between'>
          <div>
            Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo
            <span className='text-blue-600'> Điều khoản Shopee</span>
          </div>
          <div className='flex flex-col items-end'>
            <div>
              Tổng thanh toán:
              <span className='ml-4 text-2xl text-primaryColor'>₫{formatCurrency(totalCheckedPurchasePrice)}</span>
            </div>
            <Button
              onClick={handleBuyPurchases}
              className='mt-4 flex w-[180px] items-center justify-center rounded-sm bg-primaryColor py-[10px] text-sm text-white'
            >
              Đặt hàng
            </Button>
          </div>
        </div>
        {/* <div className='absolute top-[35%] right-0 h-[1px] w-full bg-gray-200'></div> */}
      </div>
    </div>
  )
}
