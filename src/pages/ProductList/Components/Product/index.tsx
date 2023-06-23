import { Link } from 'react-router-dom'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'
import ProductRating from 'src/components/ProductRating'
import { path } from 'src/constants/path'
import { useTranslation } from 'react-i18next'

interface Props {
  product: ProductType
}

export default function ProductItem({ product }: Props) {
  const url = `${path.home}${generateNameId({ name: product.name, id: product._id })}`
  const { t } = useTranslation('productDetail')
  return (
    <Link to={url}>
      <div className='rounded-sm bg-white shadow-sm transition-none duration-100 hover:translate-y-[-1px]'>
        <div className='relative z-0 w-full pt-[100%]'>
          <img
            className='absolute top-0 right-0 z-0 h-full w-[100%] rounded-t-sm object-cover'
            src={product.image}
            alt=''
          />
        </div>
        <div className=' p-2 '>
          <p className='min-h-[2rem] text-xs line-clamp-2'>{product.name}</p>
          <div className='mt-1 flex items-center'>
            <span className='hidden line-through sm:block'>{formatCurrency(product.price_before_discount)}</span>
            <span className='text-base text-primaryColor sm:ml-[5px]'>₫{formatCurrency(product.price)}</span>
          </div>
          <div className='mt-2 flex items-center'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-xs'>
              {t('sold')} {formatNumberToSocialStyle(product.sold)}{' '}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
