import { MdOutlineMenu } from 'react-icons/md'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { CiFilter } from 'react-icons/ci'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import { Category } from 'src/types/categogy.type'
import classNames from 'classnames'
import { path } from 'src/constants/path'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefineField } from 'src/types/utils.type'
import RatingStars from '../RatingStars'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefineField<Pick<Schema, 'price_max' | 'price_min'>>
const priceSchema = schema.pick(['price_max', 'price_min'])

export default function AsideFitter({ categories, queryConfig }: Props) {
  const { category } = queryConfig

  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    trigger,
    resetField,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },

    resolver: yupResolver(priceSchema)
  })

  const onsubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({ ...queryConfig, price_max: data.price_max, price_min: data.price_min }).toString()
    })
  })

  const handleRemoveAll = () => {
    resetField('price_min')
    resetField('price_max')
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'category', 'rating_filter'])).toString()
    })
  }

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
        <form className='mt-4' onSubmit={onsubmit}>
          <div className='flex items-center gap-2 text-xs'>
            <Controller
              name='price_min'
              control={control}
              render={({ field }) => {
                return (
                  <InputNumber
                    classNameInput='w-full rounded-sm border-[0.5px] border-gray-300 px-2 py-2 outline-none focus:border-gray-400'
                    type='text'
                    placeholder='₫ TỪ'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
            {/* <InputV2
              control={control}
              type='number'
              className='grow'
              name='price_min'
              placeholder='₫ TỪ'
              classNameInput='w-full rounded-sm border-[0.5px] border-gray-300 px-2 py-2 outline-none focus:border-gray-400 '
              onChange={() => {
                trigger('price_max')
              }}
            /> */}
            <div className='h-[0.75px] w-[10%] bg-slate-300'></div>
            <Controller
              name='price_max'
              control={control}
              render={({ field }) => {
                return (
                  <InputNumber
                    classNameInput='w-full rounded-sm border-[0.5px] border-gray-300 px-2 py-2 outline-none focus:border-gray-400 '
                    type='text'
                    placeholder='₫ ĐẾN'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>
          <div className='mt-2 text-center text-xs text-red-600'> {errors.price_max?.message}</div>
          <Button className='mt-5 flex w-full items-center justify-center rounded-sm bg-primaryColor p-2 text-sm uppercase text-white hover:opacity-90'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-5'>
        <h1 className=''> Đánh giá</h1>
        <RatingStars queryConfig={queryConfig} />
        <div className='my-4 h-[0.8px] bg-gray-300'></div>
        <Button
          onClick={handleRemoveAll}
          className='mt-5 flex w-full items-center justify-center rounded-sm bg-primaryColor p-2 text-sm uppercase uppercase text-white hover:opacity-90'
        >
          Xóa tất cả
        </Button>
      </div>
    </div>
  )
}
