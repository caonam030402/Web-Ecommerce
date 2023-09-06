import classNames from 'classnames'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { NavLink, createSearchParams } from 'react-router-dom'
import CountdownTimer from 'src/components/CountdownTimer'
import UseQueryParams from 'src/hooks/UseQueryParams'
import ProductSale from './components/ProductSale'
import useScrollPosition from 'src/hooks/useScrollPosition'
import { useQuery } from '@tanstack/react-query'
import { promotionApi } from 'src/apis/promotion.api'
import useMediaQuery from 'src/hooks/useMediaQuery'

export default function FlashSale() {
  const queryParams: { promotionId?: string } = UseQueryParams()
  const { isMobile } = useMediaQuery()
  const scrollTimeSlot = useScrollPosition({ scrollY: 530 })
  const scrollCountDownTime = useScrollPosition({ scrollY: 240 })

  const { data: timeSlots } = useQuery({
    queryKey: ['timeSlots'],
    queryFn: () => promotionApi.getTimeSlots()
  })

  const firstTimeSlot = timeSlots?.data.data[0]
  const promotionId = queryParams.promotionId || firstTimeSlot?._id

  const { data: promotion } = useQuery({
    queryKey: ['promotion', { promotionId }],
    queryFn: () => promotionApi.getPromotions({ promotionId: String(promotionId) }),
    keepPreviousData: true,
    enabled: Boolean(promotionId),
    staleTime: 3 * 60 * 1000
  })

  const limitTimeSLot = isMobile ? timeSlots && timeSlots.data.data.slice(0, 4) : timeSlots?.data.data

  const timeCountdown = timeSlots ? Math.floor(new Date(String(firstTimeSlot?.time_end)).getTime()) : 0
  return (
    <div className='md:container'>
      <div className={scrollCountDownTime ? 'fixed top-0 left-0 right-0 z-30 animate-slideDown' : ''}>
        <div className='flex items-center justify-center gap-3 bg-white py-3 md:py-5'>
          <img
            className='hidden w-32 md:block'
            src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/fb1088de81e42c4e538967ec12cb5caa.png'
            alt=''
          />
          <div className='flex items-center gap-1'>
            <AiOutlineClockCircle className='text-sm md:text-lg' />{' '}
            <span className='text-xs uppercase md:text-base'>Kết thúc trong</span>
          </div>
          <div>
            <CountdownTimer targetTime={timeCountdown} />
          </div>
        </div>
      </div>
      <div className=''>
        <img
          className='w-full'
          src='https://down-vn.img.susercontent.com/file/sg-11134004-7qvd3-livjlava708wef'
          alt=''
        />
      </div>

      <div className={scrollTimeSlot ? 'fixed top-0 left-0 right-0 z-20 animate-slideDown bg-gray-700 pt-[65px]' : ''}>
        <div className={`container grid grid-cols-4 overflow-auto md:grid-cols-5 ${!scrollTimeSlot && 'px-0'}`}>
          {limitTimeSLot?.map((item, index) => {
            return (
              <NavLink
                className={classNames('py-[7.5px] text-center md:text-neutral-100', {
                  'border-b-2 border-primaryColor text-primaryColor md:bg-primaryColor':
                    promotionId === String(item._id),
                  'text-gray-800 md:bg-gray-700': promotionId !== item._id
                })}
                to={{
                  search: createSearchParams({
                    promotionId: item._id
                  }).toString()
                }}
                key={index}
              >
                <div className='text-xl'>{new Date(String(item.time_start)).getHours()}:00</div>
                <div className='text-xs md:text-base'>{item === firstTimeSlot ? 'Đang diễn ra' : 'Sắp diễn ra'}</div>
              </NavLink>
            )
          })}
        </div>
      </div>

      <div className='mt-5 grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-5'>
        {promotion?.data.data.map((item, index) => {
          return <ProductSale key={index} productSale={item} />
        })}
      </div>
    </div>
  )
}
