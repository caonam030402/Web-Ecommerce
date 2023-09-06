import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import ProgressBar from 'src/components/ProgressBar'
import { path } from 'src/constants/path'
import { Promotion } from 'src/types/promotion.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

interface Props {
  productSale: Promotion
}

export default function ProductSale({ productSale }: Props) {
  const url = `${path.home}${generateNameId({ name: productSale.product.name, id: productSale.product._id })}`
  return (
    <Link to={url} className=''>
      <div className='rounded-sm bg-white shadow-sm transition-none duration-100 hover:translate-y-[-1px]'>
        <div className='relative z-0 hidden w-full pt-[100%] md:block'>
          <img
            className='absolute top-0 right-0 z-0 h-full w-[100%] rounded-t-sm object-cover'
            src={productSale.product.image}
            alt=''
          />
        </div>
        <div className=' flex items-center gap-3 p-3'>
          <div className=' block w-[30%] md:hidden'>
            <img className=' rounded-t-sm object-cover' src={productSale.product.image} alt='' />
          </div>
          <div className='flex-1'>
            <p className='min-h-[2rem] text-base line-clamp-2'>{productSale.product.name}</p>
            <div className='mt-2 flex justify-between'>
              <ProductRating rating={productSale.product.rating} />
              <div className='flex items-center border-y-[1px] border-primaryColor text-[10px] text-primaryColor'>
                <svg width='2' height='14' viewBox='0 0 2 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M0 14H2V13H1V12.993L1.11265 12.9035C1.65139 12.4391 1.98182 11.7504 1.98182 11L1.975 10.8138C1.9253 10.1363 1.60649 9.52216 1.11265 9.09653L1 9.007V8.992L1.11265 8.90347C1.65139 8.43914 1.98182 7.75043 1.98182 7L1.975 6.81377C1.9253 6.13634 1.60649 5.52216 1.11265 5.09653L1 5.007V4.992L1.11265 4.90347C1.65139 4.43914 1.98182 3.75043 1.98182 3L1.975 2.81377C1.9253 2.13634 1.60649 1.52216 1.11265 1.09653L1 1.006V1H2V0H0V1.58553C0.572242 1.79159 0.981818 2.34708 0.981818 3C0.981818 3.65292 0.572242 4.20841 0 4.41447V5.58553C0.572242 5.79159 0.981818 6.34708 0.981818 7C0.981818 7.65292 0.572242 8.20841 0 8.41447V9.58553C0.572242 9.79159 0.981818 10.3471 0.981818 11C0.981818 11.6529 0.572242 12.2084 0 12.4145V14Z'
                    fill='#EE4D2D'
                  ></path>
                </svg>
                <div className='px-1 leading-[13px]'>Giảm 10%</div>
                <svg width='2' height='14' viewBox='0 0 2 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M2 1.74846e-07L1.22392e-06 0L1.1365e-06 1L1 1V1.007L0.887356 1.09653C0.348616 1.56086 0.0181828 2.24957 0.0181828 3L0.0249962 3.18623C0.0747015 3.86366 0.39351 4.47784 0.887356 4.90347L1 4.993V5.008L0.887356 5.09653C0.348615 5.56086 0.0181825 6.24957 0.0181824 7L0.0249958 7.18623C0.0747011 7.86366 0.39351 8.47784 0.887355 8.90347L1 8.993V9.008L0.887355 9.09653C0.348615 9.56086 0.0181821 10.2496 0.0181821 11L0.0249955 11.1862C0.0747008 11.8637 0.39351 12.4778 0.887355 12.9035L1 12.994V13H8.74228e-08L0 14H2L2 12.4145C1.42776 12.2084 1.01818 11.6529 1.01818 11C1.01818 10.3471 1.42776 9.79159 2 9.58553V8.41447C1.42776 8.20841 1.01818 7.65292 1.01818 7C1.01818 6.34708 1.42776 5.79159 2 5.58553L2 4.41447C1.42776 4.20841 1.01818 3.65292 1.01818 3C1.01818 2.34708 1.42776 1.79159 2 1.58553V1.74846e-07Z'
                    fill='#EE4D2D'
                  ></path>
                </svg>
              </div>
            </div>
            <div className='mt-1 flex items-center gap-1 md:flex-col md:items-start lg:flex-row lg:items-center'>
              <span className=' line-through '>{formatCurrency(productSale.product.price)}</span>
              <span className='text-xl text-primaryColor sm:ml-[5px] md:text-2xl'>
                ₫
                {formatCurrency(Number(productSale.price)) === 'NaN'
                  ? productSale.price
                  : formatCurrency(Number(productSale.price))}
              </span>
            </div>
            <div className='mt-2 flex items-center gap-5'>
              <div className='flex-1'>
                <ProgressBar />
              </div>
              <button className='w-[40%] rounded-sm bg-primaryColor px-3 py-1 text-white'>Mua Ngay</button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
