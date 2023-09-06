import { useQuery } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { ImageSlide, Image } from 'src/assets/image/slide'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { categoryApi } from 'src/apis/category.api'
import { productApi } from 'src/apis/product.api'
import Button from 'src/components/Button'
import Pagination from 'src/components/Pagination'
import Slide from 'src/components/Slide'
import { path } from 'src/constants/path'
import { ProductListConfig } from 'src/types/product.type'
import AsideFitter from './Components/AsideFitter'
import ProductItem from './Components/Product'
import SortProductList from './Components/SortProductList'
import useQueryConfig from 'src/hooks/useQueryConfig'
import ListFlashSale from './Components/ListFlashSale'
import { SwiperSlide } from 'swiper/react'
import { promotionApi } from 'src/apis/promotion.api'

export default function ProductList() {
  const navigate = useNavigate()

  const queryConfig = useQueryConfig()

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(queryConfig, ['price_min', 'price_max', 'category', 'rating_filter', 'name', 'sort_by'])
      ).toString()
    })
  }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  const { data: timeSlots } = useQuery({
    queryKey: ['timeSlots'],
    queryFn: () => promotionApi.getTimeSlots()
  })

  const firstTimeSlot = timeSlots?.data.data[0]
  const promotionId = firstTimeSlot?._id

  const { data: promotion } = useQuery({
    queryKey: ['promotion', { promotionId }],
    queryFn: () => promotionApi.getPromotions({ promotionId: String(promotionId) }),
    keepPreviousData: true,
    enabled: Boolean(promotionId),
    staleTime: 3 * 60 * 1000
  })

  const timeCountdown = firstTimeSlot ? Math.floor(new Date(String(firstTimeSlot?.time_end)).getTime()) : 0

  const checkProductListEmpty = () => {
    if (productsData) {
      return productsData.data.data.products.length === 0
    }
  }

  return (
    <div>
      <div className='z-0 flex gap-[6px] md:container md:mt-6'>
        <Slide
          autoplay={true}
          pagination={true}
          slidesPerGroup={1}
          slidesPerView={1}
          spaceBetween={30}
          classNameSwiper='z-0 w-full md:w-[67%]'
          listItem={ImageSlide.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt='' />
            </SwiperSlide>
          ))}
        />

        <div className='hidden flex-1 flex-col gap-[6px] md:flex'>
          {Image.map((image, index) => (
            <div key={index} className=''>
              <img src={image} alt='' />
            </div>
          ))}
        </div>
      </div>
      <div>
        <ListFlashSale timeCountdown={timeCountdown} listProductSale={promotion?.data.data} />
      </div>
      <div className='container mt-4 sm:mt-8'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3 hidden sm:block lg:col-span-2'>
              <AsideFitter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            {!checkProductListEmpty() && (
              <div className='col-span-12 sm:col-span-9 lg:col-span-10'>
                <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
                <div className='mt-0 grid grid-cols-2 gap-2 md:mt-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5'>
                  {productsData?.data.data.products.map((product) => (
                    <div className='' key={product._id}>
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              </div>
            )}

            {checkProductListEmpty() && (
              <div className='col-span-10 flex flex-col items-center justify-center text-gray-500'>
                <AiOutlineFileSearch className='text-[100px]' />
                <p className='mt-3 text-lg'>Hix. Không có sản phẩm nào. Bạn thử tắt điều kiện lọc và tìm lại nhé?</p>
                <p className='mt-4'>Or</p>
                <Button
                  onClick={handleRemoveAll}
                  className='mt-4 flex w-[13%] items-center justify-center rounded-sm bg-primaryColor p-2 text-base text-white hover:opacity-90'
                >
                  Xóa Bộ Lọc
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
