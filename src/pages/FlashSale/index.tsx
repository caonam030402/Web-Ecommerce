import classNames from 'classnames'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { NavLink, createSearchParams } from 'react-router-dom'
import CountdownTimer from 'src/components/CountdownTimer'
import UseQueryParams from 'src/hooks/UseQueryParams'
import ProductSale from './components/ProductSale'
import useScrollPosition from 'src/hooks/useScrollPosition'
import { useQuery } from '@tanstack/react-query'
import { promotionApi } from 'src/apis/promotion.api'

export default function FlashSale() {
  const queryParams: { promotionId?: string } = UseQueryParams()
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

  const timeCountdown = timeSlots ? Math.floor(new Date(String(firstTimeSlot?.time_end)).getTime()) : 0

  return (
    <div className='container'>
      <div className={scrollCountDownTime ? 'fixed top-0 left-0 right-0 z-30 animate-slideDown' : ''}>
        <div className='flex items-center justify-center gap-3 bg-white py-5'>
          <img
            className='w-32'
            src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/fb1088de81e42c4e538967ec12cb5caa.png'
            alt=''
          />
          <div className='flex items-center gap-1'>
            <AiOutlineClockCircle className=' text-lg' /> <span className='uppercase'>Kết thúc trong</span>
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
        <div className={`container grid w-full grid-cols-5  ${!scrollTimeSlot && 'px-0'}`}>
          {timeSlots?.data.data.map((item, index) => {
            return (
              <NavLink
                className={classNames('py-[7.5px] text-center text-neutral-100', {
                  'bg-primaryColor': promotionId === String(item._id),
                  'bg-gray-700': promotionId !== item._id
                })}
                to={{
                  search: createSearchParams({
                    promotionId: item._id
                  }).toString()
                }}
                key={index}
              >
                <div className='text-xl'>{new Date(String(item.time_start)).getHours()}:00</div>
                <div>Đang diễn ra</div>
              </NavLink>
            )
          })}
        </div>
      </div>

      <div className='mt-5 grid grid-cols-4 gap-5'>
        {promotion?.data.data.map((item, index) => {
          return <ProductSale key={index} productSale={item} />
        })}
      </div>
    </div>
  )
}
