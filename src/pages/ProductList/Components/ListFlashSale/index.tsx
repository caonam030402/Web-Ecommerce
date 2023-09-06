import { MdArrowForwardIos } from 'react-icons/md'
import { Link } from 'react-router-dom'
import CountdownTimer from 'src/components/CountdownTimer'
import ProgressBar from 'src/components/ProgressBar/index'
import Slide from 'src/components/Slide'
import { path } from 'src/constants/path'
import useMediaQuery from 'src/hooks/useMediaQuery'
import { Promotion } from 'src/types/promotion.type'
import { formatCurrency } from 'src/utils/utils'
import { SwiperSlide } from 'swiper/react'

interface Props {
  listProductSale?: Promotion[]
  timeCountdown: number
}
export default function ListFlashSale({ listProductSale, timeCountdown }: Props) {
  const { isMobile } = useMediaQuery()
  return (
    <div className='md:container'>
      <div className='mt-7 bg-white p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center'>
            <img
              className='mr-3 w-24 md:w-32'
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/fb1088de81e42c4e538967ec12cb5caa.png'
              alt=''
            />
            <div className='mb-1'>
              <CountdownTimer targetTime={timeCountdown} />
            </div>
          </div>
          <div className='flex items-center text-primaryColor'>
            <Link to={path.flashSale} className='mr-1'>
              Xem tất cả
            </Link>
            <span>
              <MdArrowForwardIos />
            </span>
          </div>
        </div>
        <Link to={path.flashSale}>
          <Slide
            pagination={false}
            slidesPerView={isMobile ? 2.5 : 6}
            spaceBetween={30}
            slidesPerGroup={6}
            listItem={
              listProductSale &&
              listProductSale.map((item, index) => (
                <SwiperSlide key={index} className='flex flex-col items-center'>
                  <img className='w-full' src={item.product.image} alt='' />
                  <div className='mt-4 mb-2 text-sm text-primaryColor md:text-lg'>
                    ₫{formatCurrency(Number(item.price))}
                  </div>
                  <ProgressBar />
                </SwiperSlide>
              ))
            }
          />
        </Link>
      </div>
    </div>
  )
}
