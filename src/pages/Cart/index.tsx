import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { purchaseApi } from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import { produce } from 'immer'
import Popover from 'src/components/Popover'
import QuantityController from 'src/components/QuantityController'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useScrollPosition from 'src/hooks/useScrollPosition'
import { ExtendedPurchase, Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import keyBy from 'lodash/keyBy'
import { AppContext } from 'src/Contexts/app.contexts'
import noCard from 'src/assets/image/no-cart.png'
import { useTranslation } from 'react-i18next'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useMediaQuery } from 'react-responsive'

export default function Cart() {
  const isMobile = useMediaQuery({
    query: '(min-width: 768px)'
  })

  const scrollPosition = useScrollPosition()
  const { t } = useTranslation('cart')
  const { extendedPurchases, setExtendedPurchases, setPurchasePayment } = useContext(AppContext)
  const navigate = useNavigate()

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])

  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const checkedPurchasesCount = checkedPurchases.length

  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const location = useLocation()

  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, setExtendedPurchases, choosenPurchaseIdFromLocation])

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const hanleDeleteManyPurchases = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchasesIds)
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      navigate(path.payment)
      const body = checkedPurchases.map((purchase) => purchase)
      setPurchasePayment(body)
    }
  }

  const quanlityController = (purchase: ExtendedPurchase, index: number, className: string) => {
    return (
      <QuantityController
        classNameWrapper={className}
        disabled={purchase.disabled}
        value={purchase.buy_count}
        max={purchase.product.quantity}
        onDecrease={(value) => handleQuantity(index, value, value >= 1)}
        onType={handleTypeQuantity(index)}
        onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
        onFocusOut={(value) =>
          handleQuantity(
            index,
            value,
            value >= 1 &&
              value <= purchase.product.quantity &&
              value !== (purchasesInCart as Purchase[])[index].buy_count
          )
        }
      />
    )
  }

  return (
    <div className='container'>
      {purchasesInCart && purchasesInCart?.length > 0 ? (
        <div>
          <div className='hidden grid-cols-12 bg-white px-10 py-4 md:mt-10 md:grid'>
            <div className='col-span-5 flex gap-4 text-sm'>
              <input
                checked={purchasesInCart?.length === 0 ? false : isAllChecked}
                onChange={handleCheckAll}
                type='checkbox'
                className={`w-[18px] flex-shrink border-gray-100 accent-primaryColor ${
                  purchasesInCart?.length === 0 && 'cursor-not-allowed'
                }`}
                disabled={purchasesInCart?.length === 0 && true}
              />
              <h2>{t('product')}</h2>
            </div>
            <div className='col-span-7'>
              <div className='grid grid-cols-12 text-center capitalize text-gray-500'>
                <div className='col-span-3'>{t('unit price')}</div>
                <div className='col-span-3'>{t('quantity')}</div>
                <div className='col-span-3'>{t('total price')}</div>
                <div className='col-span-3'>{t('actions')}</div>
              </div>
            </div>
          </div>
          <div className='mt-6 md:mt-0'>
            {extendedPurchases?.map((purchase, index) => (
              <div
                key={purchase._id}
                className='mt-2 grid-cols-12 content-center items-center bg-white px-2 py-4 md:grid md:px-10'
              >
                <div className='col-span-5'>
                  <div className='flex w-full items-center'>
                    <input
                      checked={purchase.checked}
                      onChange={handleCheck(index)}
                      type='checkbox'
                      className='mr-4 h-[18px] w-[18px] flex-shrink-0 border-gray-100 accent-primaryColor'
                    />
                    <div className='flex items-center gap-3 text-sm' key={purchase._id}>
                      <div className='flex md:items-center'>
                        <Link
                          className='shrink-0'
                          to={`${path.home}${generateNameId({
                            name: purchase.product.name,
                            id: purchase.product._id
                          })}`}
                        >
                          <img className='h-20 w-20 ' src={purchase.product.image} alt={purchase.product.name} />
                        </Link>
                        <div className='ml-3 w-full md:ml-4 md:max-w-[70%]'>
                          <div className='line-clamp-2'>{purchase.product.name}</div>
                          <div className='mt-2 block font-bold text-primaryColor md:hidden  '>
                            ₫{formatCurrency(purchase.buy_count * purchase.price)}
                          </div>
                          <div className='flex items-center justify-between'>
                            {quanlityController(purchase, index, 'justify-start md:hidden block md:mt-0 mt-2')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-span-7 mt-3 md:mt-0'>
                  <div className='grid grid-cols-12 items-center text-center text-gray-500'>
                    <div className=' hidden md:col-span-3 md:block'>
                      <span className='mr-4 line-through'>₫{formatCurrency(purchase.price_before_discount)}</span>
                      <span>₫{formatCurrency(purchase.price)}</span>
                    </div>
                    <div className='col-span-3 hidden md:block'>{quanlityController(purchase, index, '')}</div>
                    <div className='col-span-3 hidden text-primaryColor md:block'>
                      ₫{formatCurrency(purchase.buy_count * purchase.price)}
                    </div>
                    <button
                      onClick={handleDelete(index)}
                      className='col-span-3 hidden hover:text-primaryColor md:block'
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* PC */}
          <div
            className={classNames(
              !scrollPosition ? 'shadow-sm' : 'shadow-[0_-5px_7px_-2px_rgba(0,0,0,0.1)]',
              'z-100 sticky bottom-0 mt-10 grid grid-cols-12 items-center bg-white px-3 py-4 md:px-10'
            )}
          >
            <div className='col-span-12 flex items-center justify-between md:hidden'>
              <div className='flex items-center'>
                <input
                  checked={purchasesInCart?.length === 0 ? false : isAllChecked}
                  type='checkbox'
                  onChange={handleCheckAll}
                  className={`w-[14px] flex-shrink border-gray-100 accent-primaryColor ${
                    purchasesInCart?.length === 0 && 'cursor-not-allowed'
                  }`}
                  disabled={purchasesInCart?.length === 0 && true}
                />
                <span className='ml-2 text-xs'>Chọn tất cả</span>
              </div>
              <div>
                <button onClick={hanleDeleteManyPurchases}>
                  <RiDeleteBin6Line className='text-base text-neutral-600' />
                </button>
              </div>
            </div>
            <div className='col-span-12 my-3 h-[0.1px] w-[full] bg-neutral-300 md:hidden'></div>
            <div className='col-span-3'>
              <div className='hidden text-base md:flex md:gap-3'>
                <input
                  checked={purchasesInCart?.length === 0 ? false : isAllChecked}
                  type='checkbox'
                  onChange={handleCheckAll}
                  className={`w-[18px] flex-shrink border-gray-100 accent-primaryColor ${
                    purchasesInCart?.length === 0 && 'cursor-not-allowed'
                  }`}
                  disabled={purchasesInCart?.length === 0 && true}
                />
                <h2 className='capitalize line-clamp-1'>
                  {t('select all')} ({extendedPurchases.length})
                </h2>
                <button className='ml-3' onClick={hanleDeleteManyPurchases}>
                  {t('delete')}
                </button>
              </div>
            </div>
            <div className='col-span-12 flex items-center justify-between gap-5 md:col-span-9 md:justify-end'>
              <div className='text-left md:text-right'>
                {
                  <Popover
                    arrowPosition='arrowBottom'
                    placementFloating={isMobile ? 'top-end' : 'top-start'}
                    placementArrow='top-end'
                    renderPopover={
                      <div className='w-[300px] rounded-sm bg-white p-7 shadow-md md:w-[500px]'>
                        <div className='mb-5 text-xl capitalize'>{t('discount detail')}</div>
                        <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                          <div className='capitalize'>{t('total amount')}</div>
                          <div>₫{formatCurrency(totalCheckedPurchasePrice + totalCheckedPurchaseSavingPrice)}</div>
                        </div>
                        <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                          <div className='capitalize'>{t('product discount')}</div>
                          <div>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                        </div>
                        <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                          <div>{t('saved')}</div>
                          <div className='text-primaryColor'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                          <div>{t('total')}</div>
                          <div>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                        </div>
                        <div className='mt-2 text-right text-xs text-gray-500'>
                          {t('final price shown at checkout')}
                        </div>
                      </div>
                    }
                  >
                    <div className='flex items-center'>
                      <span className='flex text-base'>
                        <span className='mr-4 line-clamp-1 md:mr-2'>{t('total')}</span>
                        <span className='hidden md:block'>
                          ( {checkedPurchasesCount} {t('product')} ):
                        </span>
                      </span>
                      <span className='text-xl text-primaryColor md:text-2xl'>
                        ₫{formatCurrency(totalCheckedPurchasePrice)}
                      </span>
                    </div>
                  </Popover>
                }
                <div>
                  <span className='mr-4'>{t('saved')}</span>
                  <span className='text-primaryColor'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</span>
                </div>
              </div>
              <Button
                onClick={handleBuyPurchases}
                className='flex items-center justify-center whitespace-nowrap rounded-sm bg-primaryColor py-[10px] px-6 text-sm capitalize text-white md:px-14'
                // disabled={buyPurchaseMutation.isLoading}
              >
                {t('check out')}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center py-20'>
          <img className='w-[120px]' src={noCard} alt='' />
          <h1 className='py-3 capitalize text-gray-500'>{t('your shopping cart is empty')}</h1>
          <Link
            to={path.home}
            className='bg-primaryColor px-8 py-2 capitalize text-white transition-all hover:opacity-80'
          >
            {t('go shopping now')}
          </Link>
        </div>
      )}
    </div>
  )
}
