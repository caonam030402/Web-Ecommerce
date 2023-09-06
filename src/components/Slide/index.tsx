/* eslint-disable import/no-unresolved */
import { Swiper } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css'
import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'
import { ReactNode } from 'react'

interface Props {
  classNameSwiper?: string
  listItem: ReactNode
  buttonStylePrev?: string
  buttonStyleNext?: string
  slidesPerView: number
  spaceBetween: number
  slidesPerGroup: number
  pagination: boolean
  autoplay?: boolean
  colorBtn?: string
  hiddenBtn?: boolean
}

export default function Slide({
  colorBtn = '#fff',
  classNameSwiper,
  slidesPerGroup,
  listItem,
  buttonStylePrev = 'rounded-tr-lg rounded-br-lg bg-black bg-opacity-20 py-5 px-2 opacity-0 transition-opacity group-hover:opacity-100',
  buttonStyleNext = 'rounded-tl-lg rounded-bl-lg bg-black bg-opacity-20 px-2 py-5 opacity-0 transition-opacity group-hover:opacity-100',
  slidesPerView,
  spaceBetween,
  pagination,
  autoplay,
  hiddenBtn = true
}: Props) {
  return (
    <Swiper
      effect='cards'
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={spaceBetween}
      loop={true}
      slidesPerView={slidesPerView}
      navigation={{ nextEl: '.button-slide-next', prevEl: '.button-slide-prev' }}
      pagination={{ clickable: true, enabled: pagination }}
      scrollbar={{ draggable: true }}
      autoplay={autoplay && { delay: 3000, disableOnInteraction: false }}
      className={`group z-0 ${classNameSwiper}`}
    >
      {listItem}
      {hiddenBtn && (
        <div className={`button-slide-prev absolute top-[50%] z-20 translate-y-[-50%] ${buttonStylePrev}`}>
          <svg
            enableBackground='new 0 0 13 20'
            viewBox='0 0 13 20'
            role='img'
            className='stardust-icon stardust-icon-arrow-left-bold w-3 text-primaryColor'
          >
            <path fill={colorBtn} stroke='none' d='m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z' />
          </svg>
        </div>
      )}
      {/* Btn next-prev design */}
      {hiddenBtn && (
        <div className={`button-slide-next absolute top-[50%] right-0 z-20 translate-y-[-50%] ${buttonStyleNext}`}>
          <svg
            enableBackground='new 0 0 13 20'
            viewBox='0 0 13 20'
            role='img'
            className='stardust-icon stardust-icon-arrow-left-bold w-3 rotate-180 text-white'
          >
            <path fill={colorBtn} stroke='none' d='m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z' />
          </svg>
        </div>
      )}
    </Swiper>
  )
}
