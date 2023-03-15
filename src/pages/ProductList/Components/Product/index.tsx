import { Link } from 'react-router-dom'
import { BsStarFill, BsStar } from 'react-icons/bs'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function ProductItem({ product }: Props) {
  return (
    <Link to=''>
      <div className='rounded-sm bg-white shadow-sm transition-none duration-100 hover:translate-y-[-1px]'>
        <div className='relative w-full pt-[100%]'>
          <img
            className='absolute top-0 right-0 h-full w-[100%] rounded-t-sm object-cover'
            src={product.image}
            alt=''
          />
        </div>
        <div className=' p-2 '>
          <p className='min-h-[2rem] text-xs line-clamp-2'>{product.name}</p>
          <div className='mt-1'>
            <span className='line-through'>{product.price_before_discount}</span>
            <span className='ml-[5px] text-base text-primaryColor'>{product.price}</span>
          </div>
          <div className='mt-5 flex items-center'>
            <div className='flex items-center text-[9px]'>
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
            </div>
            <div className='text-xs'>Đã bán {formatNumberToSocialStyle(product.sold)} </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
