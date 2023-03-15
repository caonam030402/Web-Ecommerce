import Slide from 'src/components/Slide'
import { array } from 'yup'
import AsideFitter from './AsideFitter'
import Product from './Product'
import SortProductList from './SortProductList'

export default function ProductList() {
  return (
    <div className=''>
      <div>
        <Slide />
      </div>
      <div className='container mt-10'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-2'>
            <AsideFitter />
          </div>
          <div className='col-span-10'>
            <SortProductList />
            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {Array(30)
                .fill(0)
                .map((_, index) => (
                  <div className='' key={index}>
                    <Product />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
