import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Popover from 'src/components/Popover'
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineCheck } from 'react-icons/md'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import { sortBy, order as orderConstant } from 'src/constants/product'
import classNames from 'classnames'
import { path } from 'src/constants/path'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { t } = useTranslation('productList')
  const { sort_by = sortBy.view, order } = queryConfig
  const page = Number(queryConfig.page)
  const navigate = useNavigate()

  // SORT COMMON | LATEST | SOLD
  const isActiveSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit({ ...queryConfig, sort_by: sortByValue.toString() }, ['order'])).toString()
    })
  }

  // SORT PRICE ORDER
  const isActivePriceOrder = (sortByValue: Exclude<ProductListConfig['order'], undefined>) => {
    return order === sortByValue
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({ ...queryConfig, sort_by: sortBy.price, order: orderValue }).toString()
    })
  }

  return (
    <div className='mb-3 flex w-full flex-wrap justify-between bg-gray-200/50 px-2 py-2 sm:mb-0 sm:py-3 sm:px-5'>
      <div className='grid grid-cols-12 flex-wrap items-center gap-3 sm:flex sm:justify-start'>
        <h1 className='hidden md:block'>{t('sortProductList.sort by')}</h1>
        {/* SORT COMMON */}
        <button
          className={classNames('col-span-4 flex items-center justify-center rounded-sm px-3 py-2 text-sm ', {
            'bg-primaryColor text-white hover:bg-primaryColor/80': isActiveSort(sortBy.view),
            'bg-white text-black hover:bg-slate-100': !isActiveSort(sortBy.view)
          })}
          onClick={() => handleSort(sortBy.view)}
        >
          {t('sortProductList.popular')}
        </button>
        {/* SORT LATEST */}
        <button
          className={classNames('col-span-4 flex items-center justify-center rounded-sm  px-3 py-2 text-sm', {
            'bg-primaryColor text-white hover:bg-primaryColor/80': isActiveSort(sortBy.createdAt),
            'bg-white text-black hover:bg-slate-100': !isActiveSort(sortBy.createdAt)
          })}
          onClick={() => handleSort(sortBy.createdAt)}
        >
          {t('sortProductList.latest')}
        </button>
        {/* SORT SOLD */}
        <button
          className={classNames(
            'col-span-4 hidden items-center justify-center rounded-sm px-3  py-2 text-sm sm:flex ',
            {
              'bg-primaryColor text-white hover:bg-primaryColor/80': isActiveSort(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSort(sortBy.sold)
            }
          )}
          onClick={() => handleSort(sortBy.sold)}
        >
          {t('sortProductList.top sale')}
        </button>
        {/* SORT PRICE */}
        <Popover
          classNameArrow=''
          duration={0}
          offsetTop={1}
          className='col-span-4 flex items-center'
          renderPopover={
            <div className=' rounded-sm bg-white shadow-sm '>
              <ul className='sm:w-[200px]'>
                <button
                  className=' flex w-full justify-between p-3 hover:text-primaryColor'
                  onClick={() => handlePriceOrder(orderConstant.asc as Exclude<ProductListConfig['order'], undefined>)}
                >
                  {t('sortProductList.price low to high')}
                  {isActivePriceOrder(orderConstant.asc) && (
                    <span className='text-primaryColor'>
                      <MdOutlineCheck className='text-lg text-primaryColor' />
                    </span>
                  )}
                </button>
                <button
                  className=' flex w-full justify-between p-3 hover:text-primaryColor'
                  onClick={() => handlePriceOrder(orderConstant.desc)}
                >
                  <span> {t('sortProductList.price high to low')} </span>
                  {isActivePriceOrder(orderConstant.desc) && (
                    <span className='text-primaryColor'>
                      <MdOutlineCheck className='text-lg text-primaryColor' />
                    </span>
                  )}
                </button>
              </ul>
            </div>
          }
        >
          <div className=' flex w-[200px] items-center justify-between rounded-sm bg-white px-3 py-2'>
            <span className={classNames('line-clamp-1', { 'text-primaryColor': order })}>
              {order
                ? order === orderConstant.asc
                  ? t('sortProductList.price low to high')
                  : t('sortProductList.price high to low')
                : t('sortProductList.price')}
            </span>
            <span>
              <MdKeyboardArrowDown className='text-base' />
            </span>
          </div>
        </Popover>
        {/* PAGINATION TOP */}
      </div>
      <div className='hidden items-center lg:flex'>
        <div>
          <span className='text-primaryColor'>{page}</span>
          <span>/</span>
          <span>{pageSize}</span>
        </div>
        <div className='ml-6 flex'>
          {page === 1 ? (
            <button className='mr-[1px] cursor-not-allowed rounded-sm bg-white p-3 opacity-50'>
              <MdKeyboardArrowLeft />
            </button>
          ) : (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({ ...queryConfig, page: (page - 1).toString() }).toString()
              }}
              className='mr-[1px] rounded-sm bg-white p-3'
            >
              <MdKeyboardArrowLeft />
            </Link>
          )}
          {page === pageSize ? (
            <button className='mr-[1px] cursor-not-allowed rounded-sm bg-white p-3 opacity-50'>
              <MdKeyboardArrowRight />
            </button>
          ) : (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({ ...queryConfig, page: (page + 1).toString() }).toString()
              }}
              className='rounded-sm bg-white p-3'
            >
              <MdKeyboardArrowRight />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
