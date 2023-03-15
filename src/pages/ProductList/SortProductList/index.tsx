import { Link } from 'react-router-dom'
import Popover from 'src/components/Popover'
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

export default function SortProductList() {
  return (
    <div className='flex w-full flex-wrap justify-between bg-gray-200/50 px-5 py-3'>
      <div className='flex flex-wrap items-center gap-3 '>
        <h1>Sắp xếp theo</h1>
        <button className='flex items-center justify-center rounded-sm bg-primaryColor px-3 py-2 text-sm text-white hover:opacity-90'>
          Phổ biến
        </button>
        <button className='flex items-center justify-center rounded-sm bg-white px-3 py-2 text-sm text-gray-800 hover:opacity-90'>
          Mới nhất
        </button>
        <button className='flex items-center justify-center rounded-sm bg-white px-3 py-2 text-sm text-gray-800 hover:opacity-90'>
          Bán chạy
        </button>
        <Popover
          classNameArrow=''
          duration={0}
          offsetTop={1}
          className='flex items-center'
          renderPopover={
            <div className=' rounded-sm bg-white shadow-sm'>
              <ul className='w-[200px]'>
                <Link className=' flex items-start p-3  hover:text-primaryColor' to=''>
                  Giá: Thấp đến Cao
                </Link>
                <Link className=' flex items-start p-3 hover:text-primaryColor' to=''>
                  Giá: Cao đến Thấp
                </Link>
              </ul>
            </div>
          }
        >
          <div className='flex w-[200px] items-center justify-between rounded-sm bg-white px-3 py-2'>
            <span className=''>Giá</span>
            <span>
              <MdKeyboardArrowDown className='text-base' />
            </span>
          </div>
        </Popover>
      </div>
      <div className='flex items-center'>
        <div>
          <span className='text-primaryColor'>1</span>
          <span>/</span>
          <span>9</span>
        </div>
        <div className='ml-6'>
          <button className='mr-[1px] rounded-sm bg-white p-3'>
            <MdKeyboardArrowLeft />
          </button>
          <button className='rounded-sm bg-white p-3'>
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}
