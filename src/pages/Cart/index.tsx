import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { purchaseApi } from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import { produce } from 'immer'
import Popover from 'src/components/Popover'
import QuantityController from 'src/components/QuantityController'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useScrollPosition from 'src/hooks/useScrollPosition'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { AppContext } from 'src/components/Contexts/app.contexts'
import noCard from 'src/assets/no-cart.png'

export default function Cart() {
  const scrollPosition = useScrollPosition()
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

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

  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, { autoClose: 1000 })
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
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyPurchaseMutation.mutate(body)
    }
  }

  return (
    <div className='container'>
      {purchasesInCart && purchasesInCart?.length > 0 ? (
        <div>
          <div className='mt-10 grid grid-cols-12 bg-white px-10 py-4'>
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
              <h2>Sản phẩm</h2>
            </div>
            <div className='col-span-7'>
              <div className='grid grid-cols-12 text-center text-gray-500'>
                <div className='col-span-3'>Đơn Giá</div>
                <div className='col-span-3'>Số Lượng</div>
                <div className='col-span-3'>Số Tiền</div>
                <div className='col-span-3'>Thao Tác</div>
              </div>
            </div>
          </div>
          {extendedPurchases?.map((purchare, index) => (
            <div key={purchare._id} className='mt-2 grid grid-cols-12 content-center items-center bg-white px-10 py-4'>
              <div className=' col-span-5'>
                <div className='flex items-center'>
                  <input
                    checked={purchare.checked}
                    onChange={handleCheck(index)}
                    type='checkbox'
                    className='mr-4 h-[18px] w-[18px] flex-shrink-0 border-gray-100 accent-primaryColor'
                  />
                  <Link
                    to={`${path.home}${generateNameId({ name: purchare.product.name, id: purchare.product._id })}`}
                    className=' flex items-center gap-3 text-sm'
                    key={purchare._id}
                  >
                    <div className='flex items-center'>
                      <img className='h-20 w-20' src={purchare.product.image} alt={purchare.product.name} />
                      <div className='ml-4 max-w-[70%] line-clamp-2'>{purchare.product.name}</div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className='col-span-7'>
                <div className='grid grid-cols-12 items-center text-center text-gray-500'>
                  <div className='col-span-3'>
                    <span className='mr-4 line-through'>₫{formatCurrency(purchare.price_before_discount)}</span>
                    <span>₫{formatCurrency(purchare.price)}</span>
                  </div>
                  <div className='col-span-3'>
                    {
                      <QuantityController
                        classNameWrapper=''
                        disabled={purchare.disabled}
                        value={purchare.buy_count}
                        max={purchare.product.quantity}
                        onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                        onType={handleTypeQuantity(index)}
                        onIncrease={(value) => handleQuantity(index, value, value <= purchare.product.quantity)}
                        onFocusOut={(value) =>
                          handleQuantity(
                            index,
                            value,
                            value >= 1 &&
                              value <= purchare.product.quantity &&
                              value !== (purchasesInCart as Purchase[])[index].buy_count
                          )
                        }
                      />
                    }
                  </div>
                  <div className='col-span-3 text-primaryColor'>
                    ₫{formatCurrency(purchare.buy_count * purchare.price)}
                  </div>
                  <button onClick={handleDelete(index)} className='col-span-3 hover:text-primaryColor'>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div
            className={classNames(
              !scrollPosition ? 'shadow-sm' : 'shadow-[0_-5px_7px_-2px_rgba(0,0,0,0.1)]',
              'z-100 sticky bottom-0 mt-10 grid grid-cols-12 items-center bg-white px-10 py-4 '
            )}
          >
            <div className='col-span-3'>
              <div className='flex gap-6 text-base'>
                <input
                  checked={purchasesInCart?.length === 0 ? false : isAllChecked}
                  type='checkbox'
                  onChange={handleCheckAll}
                  className={`w-[18px] flex-shrink border-gray-100 accent-primaryColor ${
                    purchasesInCart?.length === 0 && 'cursor-not-allowed'
                  }`}
                  disabled={purchasesInCart?.length === 0 && true}
                />
                <h2>Chọn tất cả ({extendedPurchases.length})</h2>
                <button onClick={hanleDeleteManyPurchases}>Xóa</button>
              </div>
            </div>
            <div className='col-span-9 flex items-center justify-end gap-5'>
              <div className='text-right'>
                {
                  <Popover
                    arrowPosition='arrowBottom'
                    placementFloating='top-end'
                    placementArrow='top-end'
                    renderPopover={
                      <div className=' w-[500px] rounded-sm bg-white p-7 shadow-md'>
                        <div className='mb-5 text-xl'>Chi tiết khuyến mãi</div>
                        <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                          <div>Tổng tiền hàng</div>
                          <div>₫{formatCurrency(totalCheckedPurchasePrice + totalCheckedPurchaseSavingPrice)}</div>
                        </div>
                        <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                          <div>Giảm giá sản phẩm</div>
                          <div>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                        </div>
                        <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                          <div>Tiết kiệm</div>
                          <div className='text-primaryColor'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                          <div>Tổng số tiền</div>
                          <div>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                        </div>
                        <div className='mt-2 text-right text-xs text-gray-500'>Số tiền cuối cùng thanh toán</div>
                      </div>
                    }
                  >
                    <div className='flex items-center'>
                      <span className='text-base'>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</span>
                      <span className='text-2xl text-primaryColor'>₫{formatCurrency(totalCheckedPurchasePrice)}</span>
                    </div>
                  </Popover>
                }
                <div>
                  <span className='mr-4'>Tiết kiệm</span>
                  <span className='text-primaryColor'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</span>
                </div>
              </div>
              <Button
                onClick={handleBuyPurchases}
                className='flex items-center justify-center rounded-sm bg-primaryColor py-[10px] px-14 text-sm text-white'
                disabled={buyPurchaseMutation.isLoading}
              >
                Mua hàng
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center py-20'>
          <img className='w-[120px]' src={noCard} alt='' />
          <h1 className='py-3 text-gray-500'>Bạn chưa có sản phẩm nào trong giỏ</h1>
          <Link to={path.home} className='bg-primaryColor px-8 py-2 text-white transition-all hover:opacity-80'>
            MUA NGAY
          </Link>
        </div>
      )}
    </div>
  )
}
