import { useContext } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { MdOutlineModeEditOutline, MdPassword } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { AppContext } from 'src/components/Contexts/app.contexts'
import { path } from 'src/constants/path'
import { getAvatarUrl } from 'src/utils/utils'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  return (
    <div className='mt-10'>
      <div className='flex items-center '>
        <img className='h-[35px] w-[35px] flex-shrink-0 rounded-full' src={getAvatarUrl(profile?.avatar)} alt='' />
        <div className='ml-3'>
          <div className='w-[70%] truncate text-sm font-bold'>{profile?.name || profile?.email}</div>
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
