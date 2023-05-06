import classNames from 'classnames'
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from 'react-icons/md'
import { Link, createSearchParams } from 'react-router-dom'
import { path } from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2
export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span className='mx-3 ' key={index}>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span className='mx-3 ' key={index}>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && page + RANGE < pageNumber && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2 + 1) {
          if (pageNumber > RANGE && page - RANGE > pageNumber) {
            return renderDotBefore(index)
          } else if (page + 2 < pageNumber && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page > pageSize - RANGE * 2 - 1 && pageNumber < page - RANGE + 1 && RANGE < pageNumber) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({ ...queryConfig, page: pageNumber.toString() }).toString()
            }}
            className={classNames('mx-3 flex items-center rounded-sm px-4 py-2 text-gray-500', {
              'bg-primaryColor text-white shadow-sm': pageNumber === page,
              'bg-transparent': pageNumber !== page
            })}
            key={index}
          >
            {index + 1}
          </Link>
        )
      })
  }
  return (
    <div className='mt-7 flex items-center justify-center text-sm text-gray-500'>
      {page === 1 ? (
        <button className='cursor-not-allowed opacity-40'>
          <MdOutlineArrowBackIos className='text-lg' />
        </button>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({ ...queryConfig, page: (page - 1).toString() }).toString()
          }}
          className=''
        >
          <MdOutlineArrowBackIos className='text-lg' />
        </Link>
      )}
      {renderPagination()}
      {page === pageSize ? (
        <button className='cursor-not-allowed opacity-40'>
          <MdOutlineArrowForwardIos className='text-lg' />
        </button>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({ ...queryConfig, page: (page + 1).toString() }).toString()
          }}
          className=''
        >
          <MdOutlineArrowForwardIos className='text-lg' />
        </Link>
      )}
    </div>
  )
}
