import { MdOutlineMenu } from 'react-icons/md'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { CiFilter } from 'react-icons/ci'
import { BsStarFill } from 'react-icons/bs'
import { createSearchParams, Link } from 'react-router-dom'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { QueryConfig } from '../..'
import { Category } from 'src/types/categogy.type'
import classNames from 'classnames'
import { path } from 'src/constants/path'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

export default function AsideFitter({ categories, queryConfig }: Props) {
  const { category } = queryConfig
  return (
    <div>
      <h1
        className={classNames('flex items-center gap-1 text-base font-semibold', {
          'text-primaryColor': !category
        })}
      >
        <MdOutlineMenu className='mr-1' /> Tất cả doanh mục
      </h1>
      <div className='my-4 h-[0.8px] bg-gray-300'></div>
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2' key={categoryItem._id}>
              <Link
                className={classNames('relative flex items-center ', {
                  'font-semibold text-primaryColor': isActive
                })}
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
              >
                {isActive && <AiOutlineCaretRight className='absolute text-[10px]' />}
                <span className='mx-3'>{categoryItem.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className='my-4 h-[0.8px] bg-gray-300'></div>
      <h1 className='flex cursor-pointer items-center gap-2 font-bold'>
        <span>
          <CiFilter className='text-base' />
        </span>
        <span>BỘ LỌC TÌM KIẾM</span>
      </h1>
      <div className='my-5'>
        <h1>Khoảng giá</h1>
        <form className='mt-4' action=''>
          <div className='flex items-center gap-2 text-xs'>
            <Input
              className=''
              classNameInput='w-full rounded-sm border-[0.5px] border-gray-300 px-2 py-2 outline-none focus:border-gray-700'
              classNameError=''
              errorMassage=''
              type='text '
              placeholder='₫ TỪ'
            />
            <div className='h-[0.75px] w-[10%] bg-slate-300'></div>
            <Input
              className=''
              classNameInput='w-full rounded-sm border-[0.5px] border-gray-300 px-2 py-2 outline-none focus:border-gray-700'
              classNameError=''
              errorMassage=''
              type='text '
              placeholder='₫ ĐẾN'
            />
          </div>
          <Button className='mt-5 flex w-full items-center justify-center rounded-sm bg-primaryColor p-2 text-sm uppercase text-white hover:opacity-90'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-5'>
        <h1 className=''> Đánh giá</h1>
        <ul className='mt-3'>
          <li className='py-1 pl-2'>
            <Link to='' className='flex items-center py-1 text-sm'>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <BsStarFill key={index} className='mr-[6px] text-yellow-500' />
                ))}
              <span>trở lên</span>
            </Link>
            <Link to='' className='flex items-center py-1 text-sm'>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <BsStarFill key={index} className='mr-[6px] text-yellow-500' />
                ))}
              <span>trở lên</span>
            </Link>
          </li>
        </ul>
        <div className='my-4 h-[0.8px] bg-gray-300'></div>
        <Button className='mt-5 flex w-full items-center justify-center rounded-sm bg-primaryColor p-2 text-sm uppercase uppercase text-white hover:opacity-90'>
          Xóa tất cả
        </Button>
      </div>
    </div>
  )
}
