import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { purchaseApi } from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import Popover from 'src/components/Popover'
import QuantityController from 'src/components/QuantityController'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useScrollPosition from 'src/hooks/useScrollPosition'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function Cart() {
  const scrollPosition = useScrollPosition()

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const purchasesInCart = purchasesInCartData?.data.data
  return (
    <div className='container px-0 shadow-sm'>
      <div className='mt-10 grid grid-cols-12 bg-white px-10 py-4'>
        <div className='col-span-5 flex gap-4 text-sm'>
          <input type='checkbox' className=' w-[18px] flex-shrink border-gray-100 accent-primaryColor' />
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
      {purchasesInCart?.map((purchare, index) => (
        <div key={purchare._id} className='mt-2 grid grid-cols-12 content-center items-center bg-white px-10 py-4'>
          <div className=' col-span-5'>
            <div className='flex items-center'>
              <input
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
                    classNameWrapper='flex items-center justify-center'
                    // onDecrease={hanleBuyCount}
                    // onType={hanleBuyCount}
                    // onIncrease={hanleBuyCount}
                    value={purchare.buy_count}
                    max={purchare.product.quantity}
                  />
                }
              </div>
              <div className='col-span-3 text-primaryColor'>₫{formatCurrency(purchare.buy_count * purchare.price)}</div>
              <button className='col-span-3 hover:text-primaryColor'>Xóa</button>
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
            <input type='checkbox' className=' w-[18px] flex-shrink border-gray-100 accent-primaryColor' />
            <h2>Chọn tất cả</h2>
            <h2>Xóa</h2>
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
                      <div>10.111k</div>
                    </div>
                    <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                      <div>Giảm giá sản phẩm</div>
                      <div>10.111k</div>
                    </div>
                    <div className='flex justify-between border-t-[1px] border-[#f3ebeb] py-3'>
                      <div>Tiết kiệm</div>
                      <div className='text-primaryColor'>10.111k</div>
                    </div>
                    <div className='flex justify-between'>
                      <div>Tổng số tiền</div>
                      <div>10.111k</div>
                    </div>
                    <div className='mt-2 text-right text-xs text-gray-500'>Số tiền cuối cùng thanh toán</div>
                  </div>
                }
              >
                <div className='flex items-center'>
                  <span className='text-base'>Tổng thanh toán (0 sản phẩm):</span>
                  <span className='text-2xl text-primaryColor'>₫0</span>
                </div>
              </Popover>
            }
            <div>
              <span className='mr-4'>Tiết kiệm</span>
              <span className='text-primaryColor'>₫0</span>
            </div>
          </div>
          <Button className='flex items-center justify-center rounded-sm bg-primaryColor py-[10px] px-14 text-sm text-white'>
            Mua hàng
          </Button>
        </div>
      </div>
    </div>
  )
}
