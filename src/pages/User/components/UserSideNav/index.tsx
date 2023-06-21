import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegUser } from 'react-icons/fa'
import { MdOutlineModeEditOutline, MdPassword } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { Link, NavLink } from 'react-router-dom'
import { AppContext } from 'src/Contexts/app.contexts'
import { path } from 'src/constants/path'
import { getAvatarUrl } from 'src/utils/utils'

export default function UserSideNav() {
  const { t } = useTranslation('user')
  const { profile } = useContext(AppContext)
  return (
    <div className='mt-10'>
      <Link to={path.profile} className='flex items-center '>
        <img className='h-[35px] w-[35px] flex-shrink-0 rounded-full' src={getAvatarUrl(profile?.avatar)} alt='' />
        <div className='ml-3'>
          <div className='w-[70%] truncate text-sm font-bold'>{profile?.name || profile?.email}</div>
          <div className='flex items-center text-gray-500'>
            <MdOutlineModeEditOutline /> <p className='capitalize'>{t('userSideNav.edit profile')}</p>
          </div>
        </div>
      </Link>
      <div className='my-8 h-[1px] w-[80%] bg-gray-200'></div>
      <div className='text-sm'>
        <div className='flex flex-col gap-5'>
          <NavLink
            to={path.profile}
            className={({ isActive }) =>
              classNames('flex items-center', {
                'text-primaryColor': isActive,
                'text-gray-600': !isActive
              })
            }
          >
            <FaRegUser className='mr-2 text-xl text-blue-700' />
            <p className='capitalize'>{t('userSideNav.my account')}</p>
          </NavLink>
          <NavLink
            to={path.changPassword}
            className={({ isActive }) =>
              classNames('flex items-center', {
                'text-primaryColor': isActive,
                'text-gray-600': !isActive
              })
            }
          >
            <MdPassword className='mr-2 text-xl text-blue-700' />
            <p className='capitalize'>{t('userSideNav.change password')}</p>
          </NavLink>
          <NavLink
            to={path.historyPurchase}
            className={({ isActive }) =>
              classNames('flex items-center', {
                'text-primaryColor': isActive,
                'text-gray-600': !isActive
              })
            }
          >
            <RiBillLine className='mr-2 text-xl text-blue-700' />
            <p className='capitalize'>{t('userSideNav.my purchase')}</p>
          </NavLink>
        </div>
      </div>
    </div>
  )
}
