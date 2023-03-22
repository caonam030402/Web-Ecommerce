import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { productApi } from 'src/apis/product.api'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { VscAdd, VscChromeMinimize } from 'react-icons/vsc'
import ProductRating from 'src/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from 'src/utils/utils'
import { BsCartPlus } from 'react-icons/bs'
import InputNumber from 'src/components/InputNumber'
import DOMPurify from 'dompurify'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const { data: productDetailData } = useQuery({
    queryKey: ['productDetail'],
    queryFn: () => productApi.getProductDetail(id as string)
  })

  const product = productDetailData?.data.data
  if (!product) return null

  return (
    <div>
      <div className='container relative mt-10 bg-white p-4 shadow'>
        <div className='grid grid-cols-12 gap-9'>
          <div className='col-span-5'>
            <div className='relative w-full pt-[100%] '>
              <img
                className='absolute top-0 right-0 h-full w-[100%] rounded-t-sm object-cover'
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className='relative mt-4 grid grid-cols-5 gap-1'>
              <button className='absolute left-0 top-1/2 z-10 flex h-9 w-5 translate-y-[-50%] items-center bg-black/20 text-white'>
                <MdOutlineNavigateBefore className='text-3xl' />
              </button>
              {product.images.slice(0, 5).map((img, index) => {
                const isActive = index === 0
                return (
                  <div className='relative w-full cursor-pointer pt-[100%]' key={img}>
                    <img
                      className='absolute top-0 right-0 h-full w-[100%] rounded-t-sm object-cover'
                      src={img}
                      alt={img}
                    />
                    {isActive && <div className='absolute inset-0 border-2 border-primaryColor'> </div>}
                  </div>
                )
              })}
              <button className='absolute right-0 top-1/2 z-10 flex h-9 w-5 translate-y-[-50%] items-center bg-black/20 text-white'>
                <MdOutlineNavigateNext className='text-3xl' />
              </button>
            </div>
          </div>
          <div className='col-span-7 mt-3'>
            <h1 className=' border-gray-100 text-lg'>{product.name}</h1>
            <div className='my-3 h-[0.5px] w-full bg-gray-100'></div>
            <div>
              <div className='mt-1 flex items-center'>
                <p className='mr-2 border-b-[1px] border-primaryColor text-base text-primaryColor'>
                  {product.rating.toFixed(1)}
                </p>
                <ProductRating
                  rating={product.rating}
                  activeClassName='mr-[2px] text-[14px] text-primaryColor'
                  noActiveClassName='mr-[2px] text-[14px] text-gray-300'
                />
                <div className='mx-4 h-5 w-[0.5px] bg-slate-300' />
                <p className='text-base'>
                  <span className='text-primaryColor'>Đã bán:</span> {formatNumberToSocialStyle(product.sold)}
                </p>
              </div>
              <div className='mt-7 bg-primaryColor/5 p-4 text-base'>
                <div className=''>
                  <span className='line-through opacity-50'>₫{formatCurrency(product.price_before_discount)}</span>{' '}
                  <span className='text-sm opacity-70'>Giảm còn</span>
                </div>
                <div className='mt-2 flex items-center font-medium text-primaryColor'>
                  <span className='text-2xl'>₫{formatCurrency(product.price)}</span>
                  <span className='ml-2 rounded-sm bg-primaryColor px-2 text-[13px] font-bold text-white'>
                    {rateSale(product.price_before_discount, product.price)} GIẢM
                  </span>
                </div>
              </div>
            </div>
            <div className='mt-8 flex items-center gap-6 text-black/60'>
              <p>Số Lượng</p>
              <div className='flex items-center border-[1px] border-r-[1px] border-gray-200'>
                <button className='px-2 py-1'>
                  <VscChromeMinimize />
                </button>
                <InputNumber
                  value='1'
                  classNameInput='text-base px-2 py-1 w-[60px] outline-none border-r-[1px] border-l-[1px] border-gray-200 text-center justify-center'
                ></InputNumber>
                <button className='px-2 py-1 '>
                  <VscAdd />
                </button>
              </div>
              <p>{product.quantity} Sản phẩm có sẵn</p>
            </div>
            <div className='mt-8 flex text-base text-primaryColor'>
              <button className='flex items-center justify-center rounded-sm border-[1px] border-primaryColor bg-primaryColor/10 py-3 px-5 capitalize hover:bg-primaryColor/5'>
                <span>
                  <BsCartPlus className='mr-2 text-xl' />
                </span>
                <span>Thêm vào giỏ hàng</span>
              </button>
              <button className='ml-3 rounded-sm border-[1px] border-primaryColor bg-primaryColor px-5 capitalize text-white hover:bg-primaryColor/90'>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='container mt-4 grid grid-cols-12 px-0'>
        <div className='col-span-10 bg-white p-8 shadow-sm'>
          <h1 className='mb-3 text-xl uppercase'>Mô tả sản phẩm</h1>
          <div
            className='overflow-hidden'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
          ></div>
        </div>
        <div className='col-span-2'></div>
      </div>
    </div>
  )
}
