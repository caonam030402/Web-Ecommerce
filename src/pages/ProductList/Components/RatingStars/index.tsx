import { useTranslation } from 'react-i18next'
import { BsStar, BsStarFill } from 'react-icons/bs'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { path } from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
}

export default function RatingStars({ queryConfig }: Props) {
  const { t } = useTranslation('productList')
  const navigate = useNavigate()
  const handleFilterStar = (ratingFilter: number) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({ ...queryConfig, rating_filter: String(ratingFilter) }).toString()
    })
  }
  return (
    <div>
      <ul className='mt-3'>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <li key={index} className='cursor-pointer py-[2px] pl-2'>
              <div
                tabIndex={0}
                role='button'
                aria-hidden='true'
                onClick={() => handleFilterStar(5 - index)}
                className='flex items-center py-1 '
              >
                {Array(5)
                  .fill(0)
                  .map((_, indexStar) => {
                    if (indexStar < 5 - index) {
                      return <BsStarFill key={indexStar} className='mr-[6px] text-[13px] text-yellow-500' />
                    } else {
                      return <BsStar key={indexStar} className='mr-[6px] text-[13px] text-yellow-500' />
                    }
                  })}
                {index !== 0 && <span className='lowercase'>{t('asideFilter.up')}</span>}
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
