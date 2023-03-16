import classNames from 'classnames'
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from 'react-icons/md'

interface Props {
  page: number
  sizePage: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const RANGE = 2
export default function Pagination({ page, setPage, sizePage }: Props) {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button className='mx-3 ' key={index}>
            ...
          </button>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <button className='mx-3 ' key={index}>
            ...
          </button>
        )
      }
      return null
    }
    return Array(sizePage)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && page + RANGE < pageNumber && pageNumber < sizePage - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < sizePage - RANGE * 2 + 1) {
          if (pageNumber > RANGE && page - RANGE > pageNumber) {
            return renderDotBefore(index)
          } else if (page + 2 < pageNumber && pageNumber < sizePage - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page > sizePage - RANGE * 2 - 1 && pageNumber < page - RANGE + 1 && RANGE < pageNumber) {
          return renderDotBefore(index)
        }
        return (
          <button
            className={classNames('mx-3 flex items-center rounded-sm px-4 py-2 text-gray-500', {
              'bg-primaryColor text-white shadow-sm': pageNumber === page,
              'bg-transparent': pageNumber !== page
            })}
            key={index}
          >
            {index + 1}
          </button>
        )
      })
  }
  return (
    <div className='mt-7 flex justify-center text-sm text-gray-500'>
      <button className=''>
        <MdOutlineArrowBackIos className='text-lg' />
      </button>
      {renderPagination()}
      <button>
        <MdOutlineArrowForwardIos className='text-lg' />
      </button>
    </div>
  )
}
