import { Link } from 'react-router-dom'
import { BsStarFill, BsStar } from 'react-icons/bs'

export default function ProductItem() {
  return (
    <Link to=''>
      <div className='rounded-sm bg-white shadow-sm transition-none duration-100 hover:translate-y-[-1px]'>
        <div className='relative w-full pt-[100%]'>
          <img
            className='absolute top-0 right-0 rounded-t-sm object-cover'
            src='https://cf.shopee.vn/file/5ad0b8b727974ec66dc47baa9c329047_tn'
            alt=''
          />
        </div>
        <div className=' p-2 '>
          <p className='min-h-[2rem] text-xs line-clamp-2'>
            Tai nghe bluetooth TWS 5.0 Không Dây Chuẩn HIFI Bản Cao Cấp
          </p>
          <div className='mt-1'>
            <span className='line-through'>₫200.000</span>
            <span className='ml-[5px] text-base text-primaryColor'>₫100.000</span>
          </div>
          <div className='mt-5 flex items-center'>
            <div className='flex items-center text-[9px]'>
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
              <BsStarFill className='mr-[5px] text-yellow-500' />
            </div>
            <div className='text-xs'>Đã bán 4,6k</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
