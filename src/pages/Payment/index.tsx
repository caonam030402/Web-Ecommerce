import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Address, District, Ward } from 'src/types/address.type'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { TfiLocationPin } from 'react-icons/tfi'
import { addressApi } from 'src/apis/address.api'
import Button from 'src/components/Button'
import { AppContext } from 'src/Contexts/app.contexts'
import Input from 'src/components/Input'
import { useOnClickOutside } from 'usehooks-ts'
import { formatCurrency } from 'src/utils/utils'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { purchaseApi } from 'src/apis/purchase.api'
import { path } from 'src/constants/path'
import { vnpPaymentApi } from 'src/apis/vnpPayment.api'
import { userApi } from 'src/apis/user.api'
import { Controller, useForm } from 'react-hook-form'
import { UserSchema, userSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import InputNumber from 'src/components/InputNumber'
import { setProfileToLS } from 'src/utils/auth'

const addressDefaultValue = {
  city: '',
  district: '',
  ward: ''
}

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone'>
const profileSchema = userSchema.pick(['name', 'address', 'phone'])

export default function Payment() {
  const [isOpenSeclect, setIsOpenSelect] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [addressCity, setAddressCity] = useState<Address>()
  const [addressDistrict, setAddressDistrict] = useState<District>()
  const { purchasePayment, profile, setProfile } = useContext(AppContext)
  const [activePayment, setActivePayment] = useState({
    Athome: true,
    VnPay: false
  })
  const [isOpenMethodPayment, setIsOpenMethodPayment] = useState(false)
  const [address, setAddress] = useState(addressDefaultValue)
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    watch,
    setValue,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: ''
    },
    resolver: yupResolver(profileSchema)
  })

  const handlePayment = (namePayment: 'ATHOME' | 'VNPAY') => {
    if (namePayment === 'ATHOME') {
      setActivePayment(() => {
        return { VnPay: false, Athome: true }
      })
    }

    if (namePayment === 'VNPAY') {
      setActivePayment(() => {
        return { Athome: false, VnPay: true }
      })
    }
  }

  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      toast.success(data.data.message, { autoClose: 1000 })
    }
  })

  const buyPurchaseByVNP = useMutation({
    mutationFn: vnpPaymentApi.postPayment,
    onSuccess: (data) => {
      window.location.href = data.data.data
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
    setValue('address', '')
  }

  const handleCloseSelect = () => {
    setIsOpenSelect(false)
    setValue('address', valueAddress)
  }

  const valueAddress = `${address.city}${address.district && ','} ${address.district}${address.ward && ','} ${
    address.ward
  }`

  const handlePickAddress = (item: Address | District | Ward, type: 'city' | 'district' | 'ward') => {
    if (type === 'city') {
      setAddressCity(item as Address)
      setAddress((prev) => ({ ...prev, city: item.Name }))
    } else if (type === 'district') {
      setAddressDistrict(item as District)
      setAddress((prev) => ({ ...prev, district: item.Name }))
    } else {
      setAddress((prev) => ({ ...prev, ward: item.Name }))
      setIsOpenSelect(false)
    }
  }

  useEffect(() => {
    valueAddress !== '  ' ? setValue('address', valueAddress) : ''
  }, [valueAddress, setValue])

  const totalCheckedPurchasePrice = useMemo(
    () =>
      purchasePayment.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [purchasePayment]
  )

  const handleOpenModal = () => {
    if (isOpenModal) {
      setIsOpenModal(false)
    } else {
      setIsOpenModal(true)
    }
  }

  useOnClickOutside(myElementRef, handleCloseSelect)

  const handleBuyPurchases = () => {
    if (profile?.address === undefined) {
      toast.error('Vui lòng điền địa chỉ trước khi mua')
    } else {
      if (purchasePayment.length > 0) {
        if (activePayment.Athome) {
          const body = purchasePayment.map((purchase) => ({
            purchase_id: purchase._id
          }))
          navigate(`${path.historyPurchase}/?status=1`)
          buyPurchaseMutation.mutate(body)
        } else {
          buyPurchaseByVNP.mutate({ amount: totalCheckedPurchasePrice, bankCode: '', language: 'vn' })
        }
      }
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    const res = await updateProfileMutation.mutateAsync({
      ...data
    })
    setIsOpenModal(false)
    toast.success(res.data.message)
    setProfileToLS(res.data.data)
    setProfile(res.data.data)
  })

  return (
    <div className='container mt-4'>
      <div className='bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-1 text-primaryColor'>
          <TfiLocationPin className='text-xl' />
          <span className='text-[17px]'>Địa Chỉ Nhận Hàng</span>
        </div>
        <div className='mt-3 text-[15px]'>
          <span className='mr-3 font-bold'>{profile?.name ? profile.name : profile?.email}</span>
          <span>{profile?.address ? profile?.address : 'Vui lòng thêm địa chỉ'}</span>
          <button onClick={handleOpenModal} className='ml-4 text-blue-500'>
            Thay đổi
          </button>
        </div>
        {isOpenModal && (
          <div className='fixed inset-0 z-50'>
            <form
              onSubmit={onSubmit}
              action=''
              className='absolute right-[50%] top-[50%] w-[550px] translate-x-[50%] translate-y-[-50%] rounded-sm bg-white p-6 text-left'
            >
              <h1 className='text-[20px]'>Địa chỉ mới</h1>
              <div className='mt-6'>
                <div ref={myElementRef} className='relative w-full'>
                  <Input
                    name='address'
                    register={register}
                    errorMessage={errors.address?.message}
                    onClick={handleOpenSelect}
                    placeholder='Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã'
                  ></Input>
                  {isOpenSeclect && (
                    <div className='absolute top-[80%] w-full border bg-white shadow-sm'>
                      <div className='grid grid-cols-3 text-center'>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': !address.city
                          })}
                        >
                          Tỉnh/Thành phố
                        </div>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': address.city !== '' && !addressDistrict
                          })}
                        >
                          Quận/Huyện
                        </div>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': address.city !== '' && address.district !== ''
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
                                type='button'
                                onClick={() => handlePickAddress(item, 'city')}
                                className='w-full p-3 text-left hover:bg-gray-100'
                                key={index}
                              >
                                {item.Name}
                              </button>
                            )
                          })}
                        {address.city !== '' &&
                          !addressDistrict &&
                          addressCity?.Districts.map((item, index) => {
                            return (
                              <button
                                type='button'
                                onClick={() => handlePickAddress(item, 'district')}
                                className='w-full p-3 text-left hover:bg-gray-100'
                                key={index}
                              >
                                {item.Name}
                              </button>
                            )
                          })}
                        {address.city !== '' &&
                          address.district !== '' &&
                          addressDistrict?.Wards.map((item, index) => {
                            return (
                              <button
                                type='button'
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
                <Input
                  errorMessage={errors.name?.message}
                  className='mt-3'
                  register={register}
                  name='name'
                  placeholder='Họ và tên'
                ></Input>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <InputNumber
                      placeholder='Số Điện Thoại'
                      errorMessage={errors.phone?.message}
                      className='mt-3'
                      classNameInput='w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                      {...field}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className='mt-7 flex justify-end gap-3'>
                <Button
                  type='button'
                  onClick={handleOpenModal}
                  className='flex w-[150px] items-center justify-center rounded-sm border py-[8px] text-sm '
                >
                  Hủy
                </Button>
                <Button
                  type='submit'
                  className='flex w-[150px] items-center justify-center rounded-sm bg-primaryColor py-[8px] text-sm text-white hover:bg-primaryColor/80'
                >
                  Hoàn Thành
                </Button>
              </div>
            </form>
            <button onClick={handleOpenModal} type='button' className='h-full w-full bg-black/50'></button>
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
                <button
                  onClick={() => handlePayment('ATHOME')}
                  className={`mr-3 border-[1px] px-3 py-2 ${
                    activePayment.Athome && 'border-[1px] border-primaryColor text-primaryColor'
                  }`}
                >
                  Thanh toán khi nhận hàng
                </button>
                <button
                  className={`border-[1px] px-3 py-2 ${
                    activePayment.VnPay && 'border-[1px] border-primaryColor text-primaryColor'
                  }`}
                  onClick={() => handlePayment('VNPAY')}
                >
                  Thánh toán qua ví VNPAY
                </button>
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
