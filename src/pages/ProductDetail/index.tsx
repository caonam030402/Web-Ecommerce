import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { productApi } from 'src/apis/product.api'
import { Product, ProductListConfig } from 'src/types/product.type'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import ProductRating from 'src/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import { BsCartPlus } from 'react-icons/bs'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import ProductItem from '../ProductList/Components/Product'
import QuantityController from 'src/components/QuantityController'
import { purchaseApi } from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import { path } from 'src/constants/path'
import { useTranslation } from 'react-i18next'
import { AiOutlineClockCircle } from 'react-icons/ai'
import CountdownTimer from 'src/components/CountdownTimer'
import moment from 'moment'

export default function ProductDetail() {
  const { t } = useTranslation('productDetail')
  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()

  const id = getIdFromNameId(nameId as string)
  const refImage = useRef<HTMLImageElement>(null)
  const queryClient = useQueryClient()

  const { data: productDetailData } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })

  const navigate = useNavigate()

  const [currentIndexImages, setCurentIndexImage] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')

  const [activeImageInModal, setActiveImageInModal] = useState('')
  const [openModalImage, setOpenModalImage] = useState(false)

  const product = productDetailData?.data.data

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const addToCartMutation = useMutation(purchaseApi.addToCart)

  const currentListImage = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    if (product && product.images) {
      setActiveImage(product.images[0])
    }
  }, [product, currentIndexImages])

  const hoverActiveImage = (img: string) => {
    setActiveImage(img)
  }

  const clickActiveImage = (img: string) => {
    setActiveImageInModal(img)
  }

  // BTN NEXT AND PREV IMAGE
  const nextImage = () => {
    if (currentIndexImages[1] < (product as Product).images.length) {
      setCurentIndexImage((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prevImage = () => {
    if (currentIndexImages[0] > 0) {
      setCurentIndexImage((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  // BTN NEXT AND PREV IMAGE IN MODAL
  const btnImageModal = (name: string) => {
    if (product && product.images) {
      const findIndexImage = product.images.findIndex((image) => {
        return image === activeImageInModal
      })

      const increaseIndexImage = name === 'next' ? findIndexImage + 1 : findIndexImage - 1

      // NEXT IMAGE MODAL
      if (name === 'next') {
        if (product.images.length > increaseIndexImage) {
          setActiveImageInModal(product.images[increaseIndexImage])
        } else {
          setActiveImageInModal(product.images[product.images.length - increaseIndexImage])
        }
      }
      // PREV IMAGE MODAL
      if (name === 'prev') {
        if (0 <= increaseIndexImage) {
          setActiveImageInModal(product.images[increaseIndexImage])
        } else {
          setActiveImageInModal(product.images[product.images.length - 1])
        }
      }
    }
  }

  const handleZoomImage = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = refImage.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    const { offsetX, offsetY } = event.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoomImage = () => {
    refImage.current?.removeAttribute('style')
  }

  const hanleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1000 })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchaseId = res.data.data._id
    navigate(path.cart, {
      state: {
        purchaseId: purchaseId
      }
    })
  }
  function convertIsoDateToCustomFormat(isoDate: Date | string) {
    const dateObj = moment.utc(isoDate)

    const hours = dateObj.format('HH')
    const minutes = dateObj.format('mm')
    const day = dateObj.format('DD')
    const month = dateObj.format('MM')

    return `${hours}:${minutes}, ${day} Th${month}`
  }

  if (!product) return null

  // check if it is correct during the promotion period
  const checkProductInTimeSlot =
    product.promotion?.time_slot && moment(product?.promotion?.time_slot.time_end).diff(moment()) / 3600000 < 3

  return (
    <div className='container'>
      <div className='container relative mt-5 bg-white p-4 shadow md:mt-10'>
        <div className='grid grid-cols-12 gap-2 lg:gap-9'>
          <div className='col-span-12 md:col-span-5'>
            <div
              onClick={() => {
                setOpenModalImage(true)
                setActiveImageInModal(activeImage)
              }}
              aria-hidden='true'
              className='relative w-full cursor-zoom-in overflow-hidden pt-[100%]'
              onMouseMove={handleZoomImage}
              onMouseLeave={handleRemoveZoomImage}
            >
              <img
                className='pointer-events-none absolute top-0 left-0 h-full w-[100%] rounded-t-sm object-cover'
                src={activeImage}
                alt={product.name}
                ref={refImage}
              />
            </div>
            <div className='relative mt-4 grid grid-cols-5 gap-1'>
              <button
                onClick={prevImage}
                className='absolute left-0 top-1/2 z-10 flex h-9 w-5 translate-y-[-50%] items-center bg-black/20 text-white'
              >
                <MdOutlineNavigateBefore className='text-3xl' />
              </button>
              {currentListImage.map((img) => {
                const isActive = img === activeImage
                return (
                  <button
                    onClick={() => {
                      setOpenModalImage(true)
                      setActiveImageInModal(img)
                    }}
                    className='relative w-full cursor-pointer pt-[100%]'
                    key={img}
                    onMouseEnter={() => hoverActiveImage(img)}
                  >
                    <img
                      className='absolute top-0 right-0 h-full w-[100%] rounded-t-sm object-cover'
                      src={img}
                      alt={img}
                    />
                    {isActive && <div className='absolute inset-0 border-2 border-primaryColor'> </div>}
                  </button>
                )
              })}
              <button
                onClick={nextImage}
                className='absolute right-0 top-1/2 z-0 flex h-9 w-5 translate-y-[-50%] items-center bg-black/20 text-white'
              >
                <MdOutlineNavigateNext className='text-3xl' />
              </button>
            </div>
          </div>
          <div className='col-span-12 mt-3 md:col-span-7'>
            <h1 className=' border-gray-100 text-lg'>{product.name}</h1>
            <div className='my-3 h-[0.5px] w-full bg-gray-100'></div>
            <div>
              <div className='mt-1 flex items-center'>
                <p className='mr-2 border-b-[1px] border-primaryColor text-base text-primaryColor'>
                  {product.rating?.toFixed(1)}
                </p>
                <ProductRating
                  rating={product.rating}
                  activeClassName='mr-[2px] text-[14px] text-primaryColor'
                  noActiveClassName='mr-[2px] text-[14px] text-gray-300'
                />
                <div className='mx-4 h-5 w-[0.5px] bg-slate-300' />
                <p className='text-base'>
                  <span className='capitalize text-primaryColor'>{t('sold')}:</span>{' '}
                  {formatNumberToSocialStyle(product.sold)}
                </p>
              </div>
              {product.promotion?.time_slot && checkProductInTimeSlot ? (
                <div className='mt-5 flex items-center justify-between bg-primaryColor px-3 py-2'>
                  <svg viewBox='0 0 108 21' height={21} width={108} className='flash-sale-logo flash-sale-logo--white'>
                    <g fill='#fff' fillRule='evenodd'>
                      <path d='M0 16.195h3.402v-5.233h4.237V8H3.402V5.037h5.112V2.075H0zm29.784 0l-.855-2.962h-4.335l-.836 2.962H20.26l4.723-14.12h3.576l4.724 14.12zM26.791 5.294h-.04s-.31 1.54-.563 2.43l-.797 2.744h2.74l-.777-2.745c-.252-.889-.563-2.43-.563-2.43zm7.017 9.124s1.807 2.014 5.073 2.014c3.13 0 4.898-2.034 4.898-4.384 0-4.463-6.259-4.147-6.259-5.925 0-.79.778-1.106 1.477-1.106 1.672 0 3.071 1.245 3.071 1.245l1.439-2.824s-1.477-1.6-4.47-1.6c-2.76 0-4.918 1.718-4.918 4.325 0 4.345 6.258 4.285 6.258 5.964 0 .85-.758 1.126-1.457 1.126-1.75 0-3.324-1.462-3.324-1.462zm12.303 1.777h3.402v-5.53h5.054v5.53h3.401V2.075h-3.401v5.648h-5.054V2.075h-3.402zm18.64-1.678s1.692 1.915 4.763 1.915c2.877 0 4.548-1.876 4.548-4.107 0-4.483-6.492-3.871-6.492-6.36 0-.987.914-1.678 2.08-1.678 1.73 0 3.052 1.224 3.052 1.224l1.088-2.073s-1.4-1.501-4.12-1.501c-2.644 0-4.627 1.738-4.627 4.068 0 4.305 6.512 3.87 6.512 6.379 0 1.145-.952 1.698-2.002 1.698-1.944 0-3.44-1.48-3.44-1.48zm19.846 1.678l-1.166-3.594h-4.84l-1.166 3.594H74.84L79.7 2.174h2.623l4.86 14.021zM81.04 4.603h-.039s-.31 1.382-.583 2.172l-1.224 3.752h3.615l-1.224-3.752c-.253-.79-.545-2.172-.545-2.172zm7.911 11.592h8.475v-2.192H91.46V2.173H88.95zm10.477 0H108v-2.192h-6.064v-3.772h4.645V8.04h-4.645V4.366h5.753V2.174h-8.26zM14.255.808l6.142.163-3.391 5.698 3.87 1.086-8.028 12.437.642-8.42-3.613-1.025z' />
                    </g>
                  </svg>

                  <div className='flex items-center'>
                    <div className='mr-3 flex items-center gap-1 text-white'>
                      <AiOutlineClockCircle className=' text-lg' /> <span className='uppercase'>Kết thúc trong</span>
                    </div>
                    <div className=''>
                      <CountdownTimer targetTime={new Date(String(product.promotion.time_slot?.time_end)).getTime()} />
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              {product.promotion?.time_slot && (
                <div className='mt-6 flex items-center'>
                  <svg
                    viewBox='0 0 108 21'
                    height={21}
                    width={108}
                    className='flash-sale-logo flash-sale-logo--white fill-primaryColor'
                  >
                    <g fill='' fillRule='evenodd'>
                      <path d='M0 16.195h3.402v-5.233h4.237V8H3.402V5.037h5.112V2.075H0zm29.784 0l-.855-2.962h-4.335l-.836 2.962H20.26l4.723-14.12h3.576l4.724 14.12zM26.791 5.294h-.04s-.31 1.54-.563 2.43l-.797 2.744h2.74l-.777-2.745c-.252-.889-.563-2.43-.563-2.43zm7.017 9.124s1.807 2.014 5.073 2.014c3.13 0 4.898-2.034 4.898-4.384 0-4.463-6.259-4.147-6.259-5.925 0-.79.778-1.106 1.477-1.106 1.672 0 3.071 1.245 3.071 1.245l1.439-2.824s-1.477-1.6-4.47-1.6c-2.76 0-4.918 1.718-4.918 4.325 0 4.345 6.258 4.285 6.258 5.964 0 .85-.758 1.126-1.457 1.126-1.75 0-3.324-1.462-3.324-1.462zm12.303 1.777h3.402v-5.53h5.054v5.53h3.401V2.075h-3.401v5.648h-5.054V2.075h-3.402zm18.64-1.678s1.692 1.915 4.763 1.915c2.877 0 4.548-1.876 4.548-4.107 0-4.483-6.492-3.871-6.492-6.36 0-.987.914-1.678 2.08-1.678 1.73 0 3.052 1.224 3.052 1.224l1.088-2.073s-1.4-1.501-4.12-1.501c-2.644 0-4.627 1.738-4.627 4.068 0 4.305 6.512 3.87 6.512 6.379 0 1.145-.952 1.698-2.002 1.698-1.944 0-3.44-1.48-3.44-1.48zm19.846 1.678l-1.166-3.594h-4.84l-1.166 3.594H74.84L79.7 2.174h2.623l4.86 14.021zM81.04 4.603h-.039s-.31 1.382-.583 2.172l-1.224 3.752h3.615l-1.224-3.752c-.253-.79-.545-2.172-.545-2.172zm7.911 11.592h8.475v-2.192H91.46V2.173H88.95zm10.477 0H108v-2.192h-6.064v-3.772h4.645V8.04h-4.645V4.366h5.753V2.174h-8.26zM14.255.808l6.142.163-3.391 5.698 3.87 1.086-8.028 12.437.642-8.42-3.613-1.025z' />
                    </g>
                  </svg>
                  <div className='mb-1 ml-2 text-sm'>
                    <span className='uppercase'>bắt đầu sau </span>
                    <span>{convertIsoDateToCustomFormat(String(product.promotion?.time_slot.time_start))}</span>
                  </div>
                </div>
              )}
              <div className='mt-4 bg-primaryColor/5 p-4 text-base'>
                <div className=''>
                  <span className='line-through opacity-50'>₫{formatCurrency(product.price_before_discount)}</span>{' '}
                  <span className='text-sm capitalize opacity-70'>{t('reduced')}</span>
                </div>
                <div className='mt-2 flex items-center font-medium text-primaryColor'>
                  <span className='text-2xl'>
                    ₫
                    {formatCurrency(
                      checkProductInTimeSlot && product.promotion?.time_slot
                        ? Number(product.promotion.price)
                        : product.price
                    )}
                  </span>
                  <span className='ml-2 rounded-sm bg-primaryColor px-2 text-[13px] font-bold uppercase text-white'>
                    {rateSale(product.price_before_discount, product.price)} {t('off')}
                  </span>
                </div>
              </div>
            </div>
            <div className='mt-8 flex items-center gap-6 text-black/60'>
              <p className='hidden capitalize md:block'>{t('quantity')}</p>
              <QuantityController
                onDecrease={hanleBuyCount}
                onType={hanleBuyCount}
                onIncrease={hanleBuyCount}
                value={buyCount}
                max={product.quantity}
              />
              <p>
                {product.quantity} {t('pieces available')}
              </p>
            </div>
            <div className='mt-8 hidden text-base text-primaryColor sm:flex'>
              <button
                onClick={addToCart}
                className='flex items-center justify-center rounded-sm border-[1px] border-primaryColor bg-primaryColor/10 py-3 px-5 capitalize hover:bg-primaryColor/5'
              >
                <span>
                  <BsCartPlus className='mr-2 text-xl' />
                </span>
                <span className='capitalize'>{t('add to cart')}</span>
              </button>
              <button
                onClick={buyNow}
                className='ml-3 rounded-sm border-[1px] border-primaryColor bg-primaryColor px-5 capitalize text-white hover:bg-primaryColor/90'
              >
                {t('buy now')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='container mt-4 grid grid-cols-12 px-0'>
        <div className='col-span-12 bg-white p-4 shadow-sm md:p-8'>
          <h1 className='mb-3 text-xl uppercase'>{t('product description')}</h1>
          <div
            className='overflow-hidden text-sm text-neutral-700'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
          ></div>
        </div>
      </div>
      {/* MODAL */}
      {openModalImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <button onClick={() => setOpenModalImage(false)} className='fixed inset-0 cursor-pointer'></button>
          <div className=' grid h-[70vh] w-[100vh] grid-cols-12 gap-2 rounded-sm bg-white p-3 shadow-sm'>
            <div className='relative col-span-8 w-full cursor-pointer pt-[100%]'>
              <img
                className='absolute top-0 right-0 h-full w-[100%] rounded-t-sm object-cover '
                src={activeImageInModal}
                alt=''
              />
              <button
                onClick={() => btnImageModal('next')}
                className='absolute right-0 top-1/2 z-0 flex h-12 w-7 translate-y-[-50%] items-center bg-black/20 text-white'
              >
                <MdOutlineNavigateNext className='text-8xl' />
              </button>
              <button
                onClick={() => btnImageModal('prev')}
                className='absolute left-0 top-1/2 z-10 flex h-12 w-7 translate-y-[-50%] items-center bg-black/20 text-white'
              >
                <MdOutlineNavigateBefore className='text-8xl' />
              </button>
            </div>

            <div className='col-span-4'>
              <div className='grid grid-cols-3 gap-2'>
                {product.images.map((img) => {
                  const isActive = img === activeImageInModal
                  return (
                    <button
                      className='relative cursor-pointer pt-[100%]'
                      key={img}
                      onClick={() => clickActiveImage(img)}
                    >
                      <img
                        className='absolute top-0 right-0 h-full w-[100%] rounded-t-sm object-cover'
                        src={img}
                        alt={img}
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-primaryColor'> </div>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {productsData && (
        <div className='container z-0 mt-6 p-0'>
          <h1 className='mb-3 uppercase text-gray-600'>{t('you may also like')}</h1>
          <div className=' grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {productsData?.data.data.products.map((product) => (
              <div className='' key={product._id}>
                <ProductItem product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Nav Mobile */}
      <div className='required: fixed bottom-0 left-0 col-span-12 grid w-full grid-cols-12 bg-white text-primaryColor shadow-md sm:hidden'>
        <button
          onClick={addToCart}
          className='col-span-6 flex flex-col items-center justify-center bg-secondaryYellow py-3 capitalize text-white transition hover:opacity-90'
        >
          <span>
            <BsCartPlus className='text-xl' />
          </span>
        </button>
        <button
          onClick={buyNow}
          className='col-span-6 bg-primaryColor capitalize text-white transition hover:bg-primaryColor/90'
        >
          {t('buy now')}
        </button>
      </div>
    </div>
  )
}
