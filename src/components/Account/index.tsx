import React, { useContext } from 'react'
import Popover from '../Popover'
import { Link, useNavigate } from 'react-router-dom'
import { path } from 'src/constants/path'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from 'src/apis/auth.api'
import { AppContext } from 'src/Contexts/app.contexts'
import { purchasesStatus } from 'src/constants/purchase'
import { getAvatarUrl } from 'src/utils/utils'

interface Props {
  name?: boolean
  pathTo: string
}

export default function Account({ name = true, pathTo }: Props) {
  const { t } = useTranslation('header')
  const { setIsAuthenticated, setProfile, profile, isAuthenticated } = useContext(AppContext)

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
    <Popover
      className=''
      renderPopover={
        isAuthenticated ? (
          <div className='relative z-50 flex flex-col items-start rounded-sm bg-white shadow-xl'>
            <button className='px-3 py-2 hover:text-primaryColor'>
              <Link className='block' to={path.profile}>
                {t('navHeader.my account')}
              </Link>
            </button>
            <Link to={path.historyPurchase} className='px-3 py-2 capitalize hover:text-primaryColor'>
              {t('navHeader.purchase')}
            </Link>
            <button onClick={handleLogout} className='px-3 py-2 capitalize hover:text-primaryColor'>
              {t('navHeader.logout')}
            </button>
          </div>
        ) : (
          <div className=' flex flex-col items-start rounded-sm bg-white shadow-xl'>
            <button className='px-3 py-2 hover:text-primaryColor'>
              <Link className='block' to={path.login}>
                {t('navHeader.login')}
              </Link>
            </button>
            <button className='px-3 py-2 hover:text-primaryColor'>
              <Link className='block' to={path.register}>
                {t('navHeader.register')}
              </Link>
            </button>
          </div>
        )
      }
    >
      <Link to={pathTo}>
        <div className='flex items-center'>
          <img src={getAvatarUrl(profile?.avatar)} alt='' className='mr-1 w-6 shrink-0 rounded-full object-cover' />
          {name && <p className='flex-shrink-0'>{profile?.email}</p>}
        </div>
      </Link>
    </Popover>
  )
}
