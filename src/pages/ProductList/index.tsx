import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { categoryApi } from 'src/apis/category.api'
import { productApi } from 'src/apis/product.api'
import Button from 'src/components/Button'
import Pagination from 'src/components/Pagination'
import Slide from 'src/components/Slide'
import { path } from 'src/constants/path'
import { ProductListConfig } from 'src/types/product.type'
import AsideFitter from './Components/AsideFitter'
import ProductItem from './Components/Product'
import SortProductList from './Components/SortProductList'
import useQueryConfig from 'src/hooks/useQueryConfig'

export default function ProductList() {
  const navigate = useNavigate()

  const queryConfig = useQueryConfig()

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(queryConfig, ['price_min', 'price_max', 'category', 'rating_filter', 'name', 'sort_by'])
      ).toString()
    })
  }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  const checkProductListEmpty = () => {
    if (productsData) {
      return productsData.data.data.products.length === 0
    }
  }

  return (
    <div>
      <div>
        <Slide />
      </div>
      <div className='container mt-10'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-2'>
              <AsideFitter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            {!checkProductListEmpty() && (
              <div className='col-span-10'>
                <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
                <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {productsData?.data.data.products.map((product) => (
                    <div className='' key={product._id}>
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              </div>
            )}

            {checkProductListEmpty() && (
              <div className='col-span-10 flex flex-col items-center justify-center text-gray-500'>
                <AiOutlineFileSearch className='text-[100px]' />
                <p className='mt-3 text-lg'>Hix. Không có sản phẩm nào. Bạn thử tắt điều kiện lọc và tìm lại nhé?</p>
                <p className='mt-4'>Or</p>
                <Button
                  onClick={handleRemoveAll}
                  className='mt-4 flex w-[13%] items-center justify-center rounded-sm bg-primaryColor p-2 text-base text-white hover:opacity-90'
                >
                  Xóa Bộ Lọc
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
