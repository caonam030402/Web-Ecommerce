import { FaRegUser } from 'react-icons/fa'
import { MdOutlineModeEditOutline, MdPassword } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { path } from 'src/constants/path'

export default function UserSideNav() {
  return (
    <div className='mt-10'>
      <div className='flex items-center '>
        <img
          className='h-[35px] w-[35px] flex-shrink-0 rounded-full'
          src='https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/325943176_1141910926526874_1884396859380038867_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=wgGjK5WTTLUAX_GDlQs&_nc_ht=scontent.fdad3-5.fna&oh=00_AfAa2EzN9kp8srMqAUr4X6ZRZZxV5cS3-dqpLNeExF1MAQ&oe=645D0E58'
          alt=''
        />
        <div className='ml-3'>
          <div className='text-sm font-bold'>Caonam0304</div>
          <div className='flex items-center text-gray-500'>
            <MdOutlineModeEditOutline /> <p>Sửa Hồ Sơ</p>
          </div>
        </div>
      </div>
      <div className='my-8 h-[1px] w-[80%] bg-gray-200'></div>
      <div className='text-sm'>
        <div className='flex flex-col gap-5'>
          <Link to={path.profile} className='flex items-center'>
            <FaRegUser className='mr-2 text-xl text-blue-700' />
            <p>Tài Khoản Của Tôi</p>
          </Link>
          <Link to={path.changPassword} className='flex items-center'>
            <MdPassword className='mr-2 text-xl text-blue-700' />
            <p>Đổi Mật Khẩu</p>
          </Link>
          <Link to={path.historyPurchase} className='flex items-center'>
            <RiBillLine className='mr-2 text-xl text-blue-700' />
            <p>Đơn Mua</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
