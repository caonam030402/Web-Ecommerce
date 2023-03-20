import { useQuery } from '@tanstack/react-query'
import { omitBy, isUndefined } from 'lodash'
import { categoryApi } from 'src/apis/category.api'
import { productApi } from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import Slide from 'src/components/Slide'
import UseQueryParams from 'src/hooks/UseQueryParams'
import { ProductListConfig } from 'src/types/product.type'
import AsideFitter from './Components/AsideFitter'
import ProductItem from './Components/Product'
import SortProductList from './Components/SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = UseQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },

    isUndefined
  )

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div>
      <div>
        <Slide />
      </div>
      <div className='container mt-10'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-2'>
              <AsideFitter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className='col-span-10'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productData?.data.data.products.map((product) => (
                  <div className='' key={product._id}>
                    <ProductItem product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
