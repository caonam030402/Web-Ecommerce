import dealNotify from '../../assets/image/deal.jpg'
import { AiFillInstagram } from 'react-icons/ai'
import { FaFacebook } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Popover from '../Popover'
import { MdLanguage, MdNotificationsNone } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
import { path } from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from '../Contexts/app.contexts'
import avatar from '../../assets/ava.jpg'
import { purchasesStatus } from 'src/constants/purchase'
import { authApi } from 'src/apis/auth.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAvatarUrl } from 'src/utils/utils'

export default function NavHeader() {
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const queryClient = useQueryClient()

  //Navigate
  const navigate = useNavigate()

  // logout Mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      navigate(path.home)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <div className='flex justify-between text-[13px] font-normal'>
      <div className='flex gap-5'>
        <Link to=''>Kênh Người Bán</Link>
        <Link to=''>Trở thành Người bán Shopee</Link>

        <div>
          <div className=' flex items-center'>
            <span className='mr-[4px]'>Kết nối</span>
            <span className='flex items-center gap-1'>
              <FaFacebook className='text-[17px]' />
              <AiFillInstagram className='text-xl' />
            </span>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-5'>
        {/* Popover Notifi */}
        <Popover
          className='flex items-center'
          renderPopover={
            <div className='rounded-sm bg-white shadow-sm'>
              <h1 className='p-3 text-gray-400'>Thông Báo Mới Nhận</h1>
              <ul>
                <Link className=' flex items-start p-3 hover:bg-slate-50 ' to=''>
                  <img className='mr-2 h-10 w-10' src={dealNotify} alt='' />
                  <div>
                    <h1>SALE ĐẾN 50% HÀNG QUỐC TẾ</h1>
                    <p className='max-w-[340px] text-xs font-normal text-gray-500'>
                      Thêm Voucher đến 100.000Đ hàng quốc tế, sale là mê, dùng là phê
                    </p>
                  </div>
                </Link>
              </ul>
              <Link to=''>
                <p className='py-3 text-center hover:bg-gray-50'>Xem tất cả</p>
              </Link>
            </div>
          }
        >
          <MdNotificationsNone className='mr-[2px] text-[22px]' />
          <span>Thông Báo</span>
        </Popover>
        <Link className='flex items-center' to=''>
          <BiHelpCircle className='mr-[2px] text-[20px]' />
          <span>Hỗ Trợ</span>
        </Link>
        {/* Popover Language */}
        <Popover
          renderPopover={
            <div className='flex flex-col items-start rounded-sm bg-white shadow-xl'>
              <button className='py-2 pr-20 pl-3 hover:text-primaryColor'>Tiếng Việt</button>
              <button className='py-2 pr-20 pl-3 hover:text-primaryColor'>English</button>
            </div>
          }
          className='flex cursor-pointer items-center'
        >
          <MdLanguage className='mr-[2px] text-xl' />
          <span>Tiếng Việt</span>
        </Popover>

        {/* Popover Login */}
        {isAuthenticated ? (
          <Popover
            renderPopover={
              <div className='flex flex-col items-start rounded-sm bg-white shadow-xl'>
                <button className='px-3 py-2 hover:text-primaryColor'>
                  <Link className='block' to={path.profile}>
                    Tài khoản của tôi
                  </Link>
                </button>
                <button className=' px-3 py-2 hover:text-primaryColor'>Đơn Mua</button>
                <button onClick={handleLogout} className='px-3 py-2 hover:text-primaryColor'>
                  Đăng Xuất
                </button>
              </div>
            }
          >
            <Link to=''>
              <div className='flex items-center'>
                <img src={getAvatarUrl(profile?.avatar)} alt='' className='mr-1 w-5 rounded-full object-cover' />
                <p className='flex-shrink-0'>{profile?.email}</p>
              </div>
            </Link>
          </Popover>
        ) : (
          <div>
            <Link className='mr-5' to={path.login}>
              Đăng nhập
            </Link>
            <Link to={path.register}>Đăng kí</Link>
          </div>
        )}
      </div>
    </div>
  )
}
