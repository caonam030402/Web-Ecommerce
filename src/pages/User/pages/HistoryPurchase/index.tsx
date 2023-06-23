import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, NavLink, createSearchParams, useNavigate } from 'react-router-dom'
import { purchaseApi } from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import UseQueryParams from 'src/hooks/UseQueryParams'
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { AiOutlineFieldTime } from 'react-icons/ai'
import noCard from 'src/assets/image/no-cart.png'
import { useTranslation } from 'react-i18next'

export default function HistoryPurchase() {
  const { t } = useTranslation('user')

  // const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLInputElement>
  // const { events } = useDraggable(ref)

  const purchaseTabs = [
    { status: purchasesStatus.all, name: t('Purchase.all') },
    { status: purchasesStatus.waitForConfirmation, name: t('Purchase.wait for confirmation') },
    { status: purchasesStatus.waitForGetting, name: t('Purchase.wait for getting') },
    { status: purchasesStatus.inProgress, name: t('Purchase.in progress') },
    { status: purchasesStatus.delivered, name: t('Purchase.delivered') },
    { status: purchasesStatus.cancelled, name: t('Purchase.cancelled') }
  ]

  const queryParams: { status?: string } = UseQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const navigate = useNavigate()

  const purchasesInCart = purchasesInCartData?.data.data

  const addToCartMutation = useMutation(purchaseApi.addToCart)

  const buyNow = async (buyCount: number, product_id: string) => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product_id })
    const purchaseId = res.data.data._id

    navigate(path.cart, {
      state: {
        purchaseId: purchaseId
      }
    })
  }

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <NavLink
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames(
        ' flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center capitalize',
        {
          'border-b-primaryColor text-primaryColor': status === tab.status,
          'border-b-black/10 text-gray-900': status !== tab.status
        }
      )}
    >
      {tab.name}
    </NavLink>
  ))

  const productPrice = (purchase: Purchase) => {
    return (
      <>
        <span className='mr-1 text-gray-300 line-through'>₫{formatCurrency(purchase.price_before_discount)}</span>
        <span className='text-primaryColor'>₫{formatCurrency(purchase.price)}</span>
      </>
    )
  }
  return (
    <div>
      <div className='overflow-x-auto text-gray-700 scrollbar scrollbar-w-full scrollbar-h-1'>
        <div className='min-w-[700px]'>
          <div>
            <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          </div>
        </div>
      </div>
      {purchasesInCart && purchasesInCart?.length > 0 ? (
        <div>
          {purchasesInCart?.map((purchase) => (
            <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
              <Link
                className='flex flex-col'
                to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
              >
                <div className='items-center justify-between md:flex'>
                  <div className='flex items-center'>
                    <img
                      className='mr-3 h-20 w-20 border-[1px] border-black/20 object-cover'
                      src={purchase.product.image}
                      alt=''
                    />
                    <div>
                      <div className='text-base line-clamp-2'>{purchase.product.name}</div>
                      <div className='mt-1 flex items-center justify-between'>
                        <div className='flex'>
                          <span className='mr-1 md:hidden'>x</span>
                          <div className='flex'>
                            <span className='mr-1 hidden md:block'>{t('Purchase.quanlity')}:</span>
                            <span>{purchase.buy_count}</span>
                          </div>
                        </div>
                        <div className='block md:hidden'>{productPrice(purchase)}</div>
                      </div>
                    </div>
                  </div>
                  <div className='hidden md:block'>
                    <div>{productPrice(purchase)}</div>
                  </div>
                </div>
                <div className='mt-6 flex items-end justify-between md:items-center'>
                  <div className='flex items-center'>
                    <span className='mr-2'>
                      <AiOutlineFieldTime className='text-2xl' />
                    </span>
                    <span className=''>{new Date(purchase.updatedAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className='flex flex-col items-end'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs capitalize md:text-sm'>{t('Purchase.into money')}:</span>
                      <span className='text-lg text-primaryColor md:text-2xl'>
                        ₫{formatCurrency(purchase.buy_count * purchase.price)}
                      </span>
                    </div>
                    <Button
                      className='mt-4 flex w-[180px] items-center justify-center rounded-sm bg-primaryColor py-[10px] text-sm text-white'
                      onClick={() => buyNow(purchase.buy_count, purchase.product._id)}
                    >
                      {t('Purchase.repurchase')}
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-5 flex flex-col items-center rounded-sm bg-white py-40 shadow-sm'>
          <img className='h-24 w-24' src={noCard} alt='' />
          <div>{t('Purchase.no orders yet')}</div>
        </div>
      )}
    </div>
  )
}
