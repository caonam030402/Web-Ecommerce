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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('payment')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
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
      <div className='bg-white p-3 shadow-sm md:p-6'>
        <div className='flex items-center gap-1 text-primaryColor'>
          <TfiLocationPin className='text-xl' />
          <span className='text-[17px] capitalize'>{t('delivery address')}</span>
        </div>
        <div className='mt-3 text-[15px]'>
          <span className='mr-3 font-bold'>{profile?.name ? profile.name : profile?.email}</span>
          <span>{profile?.address ? profile?.address : 'Vui lòng thêm địa chỉ'}</span>
          <button onClick={handleOpenModal} className='ml-4 text-blue-500'>
            {t('change')}
          </button>
        </div>
        {isOpenModal && (
          <div className='fixed inset-0 z-50'>
            <form
              onSubmit={onSubmit}
              action=''
              className='absolute right-[50%] top-[50%] w-[85%] translate-x-[50%] translate-y-[-50%] rounded-sm bg-white p-6 text-left md:w-[40%]'
            >
              <h1 className='text-[20px] capitalize'>{t('new address')}</h1>
              <div className='mt-6'>
                <div ref={myElementRef} className='relative w-full'>
                  <Input
                    name='address'
                    register={register}
                    errorMessage={errors.address?.message}
                    onClick={handleOpenSelect}
                    placeholder={`${t('province/City')}, ${t('district/District')}, ${t('ward/Commune')}`}
                  ></Input>
                  {isOpenSeclect && (
                    <div className='absolute top-[80%] w-full border bg-white shadow-sm'>
                      <div className='grid grid-cols-3 text-center'>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': !address.city
                          })}
                        >
                          {t('province/City')}
                        </div>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': address.city !== '' && !addressDistrict
                          })}
                        >
                          {t('district/District')}
                        </div>
                        <div
                          className={classNames('border-b-2 py-4 ', {
                            'border-primaryColor text-primaryColor': address.city !== '' && address.district !== ''
                          })}
                        >
                          {t('ward/Commune')}
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
                  className='mt-3 placeholder:capitalize'
                  register={register}
                  name='name'
                  placeholder={t('full name')}
                ></Input>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <InputNumber
                      placeholder={t('phone number')}
                      errorMessage={errors.phone?.message}
                      className='mt-3'
                      classNameInput=' placeholder:capitalize w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
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
                  {t('cancel')}
                </Button>
                <Button
                  type='submit'
                  className='flex w-[150px] items-center justify-center rounded-sm bg-primaryColor py-[8px] text-sm text-white hover:bg-primaryColor/80'
                >
                  {t('complete')}
                </Button>
              </div>
            </form>
            <button onClick={handleOpenModal} type='button' className='h-full w-full bg-black/50'></button>
          </div>
        )}
      </div>
      <div className='mt-3 rounded-sm bg-white p-3 shadow-sm md:p-6'>
        <table className='text-sx w-full text-center'>
          <thead>
            <tr className='hidden text-gray-400 md:contents'>
              <th className='text-left text-lg font-normal capitalize text-gray-800'>{t('product')}</th>
              <th className='font-normal capitalize'>{t('into money')}</th>
              <th className='font-normal capitalize'>{t('quanlity')}</th>
              <th className='text-right font-normal capitalize'>{t('total payment')}</th>
            </tr>
          </thead>
          <tbody>
            {purchasePayment.map((purchase, index) => (
              <tr key={index} className='text-center'>
                <td className='pt-3 pb-0 md:max-w-[300px] md:pt-6'>
                  <div className='flex items-start gap-3 md:items-center'>
                    <img className='h-14 w-14 shrink-0 border object-cover' src={purchase.product.image} alt='' />
                    <div className='w-full'>
                      <span className='text-left line-clamp-2'>{purchase.product.name}</span>
                      <div className='mt-2 flex justify-between md:hidden'>
                        <div className='pb-0'>x{formatCurrency(purchase.buy_count)}</div>
                        <div className='pb-0 font-bold text-primaryColor'>
                          ₫{formatCurrency(purchase.buy_count * purchase.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className='hidden pb-0 md:table-cell md:pt-6'>₫{formatCurrency(purchase.price)}</td>
                <td className='hidden pb-0 md:table-cell md:pt-6'>{formatCurrency(purchase.buy_count)}</td>
                <td className='hidden pb-0 text-right md:table-cell md:pt-6'>
                  ₫{formatCurrency(purchase.buy_count * purchase.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='relative mt-3 bg-white p-3 shadow-sm md:p-6'>
        {!isOpenMethodPayment ? (
          <div className='flex items-center justify-between'>
            <div className='hidden text-lg font-normal capitalize text-gray-800 md:block'>{t('payment methods')}</div>
            <div>
              <span className='mr-16 capitalize'>{t('payment on delivery')}</span>
              <button onClick={handleOpenMethodPayment} className='uppercase text-blue-600'>
                {t('change')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className='flex items-center gap-5 md:mt-3'>
              <h1 className='hidden text-lg md:block'>{t('payment methods')}</h1>
              <div className='w-full'>
                <button
                  onClick={() => handlePayment('ATHOME')}
                  className={`mr-3 border-[1px] px-3 py-2 ${
                    activePayment.Athome && 'border-[1px] border-primaryColor text-primaryColor'
                  }`}
                >
                  {t('delivery')}
                </button>
                <button
                  className={`border-[1px] px-3 py-2 ${
                    activePayment.VnPay && ' border-[1px] border-primaryColor text-primaryColor'
                  }`}
                  onClick={() => handlePayment('VNPAY')}
                >
                  {t('via VNPAY wallet')}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className='mt-4 flex items-end justify-between md:mt-6'>
          <div className='hidden md:block'>
            {t('clicking Order means you agree to abide by the')}
            <span className='text-blue-600'> {t('shopee terms')}</span>
          </div>
          <div className='flex items-center md:flex-col md:items-end'>
            <div className='capitalize'>
              {t('total payment')}:
              <span className='text-xl text-primaryColor md:ml-4 md:text-2xl'>
                ₫{formatCurrency(totalCheckedPurchasePrice)}
              </span>
            </div>
            <Button
              onClick={handleBuyPurchases}
              className='flex w-[180px] items-center justify-center rounded-sm bg-primaryColor py-[10px] text-sm capitalize text-white md:mt-4'
            >
              {t('order')}
            </Button>
          </div>
        </div>
        {/* <div className='absolute top-[35%] right-0 h-[1px] w-full bg-gray-200'></div> */}
      </div>
    </div>
  )
}
