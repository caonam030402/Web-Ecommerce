import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation('footer')
  return (
    // my-10 border-t-4 border-primaryColor
    <footer className='my-10'>
      <div className='x mx-auto mt-9 px-3 text-gray-500 lg:max-w-7xl lg:px-0 lg:text-left'>
        <div className=' grid grid-cols-1 text-center text-sm lg:grid-cols-3 lg:text-left'>
          <p className='lg:col-span-1'>{t('© 2023 CaoNam. All rights reserved')}</p>
          <p className=' lg:col-span-2 '>{t('country & Region')}</p>
        </div>
        <div className='mt-12 hidden text-center uppercase lg:block'>
          <Link
            to=''
            className='relative px-4 after:absolute after:right-0 after:top-[50%] after:h-4 after:w-[0.25px] after:translate-y-[-50%] after:bg-gray-400'
          >
            {t('privacy Policy')}
          </Link>
          <Link
            to=''
            className='relative px-4 after:absolute after:right-0 after:top-[50%] after:h-4 after:w-[0.25px] after:translate-y-[-50%] after:bg-gray-400'
          >
            {t('regulations and activities')}
          </Link>
          <Link
            to=''
            className='relative px-4 after:absolute after:right-0 after:top-[50%] after:h-4 after:w-[0.25px] after:translate-y-[-50%] after:bg-gray-400'
          >
            {t('return and refund policy')}
          </Link>
          <Link to='' className='px-4'>
            {t('shipping policy')}
          </Link>
        </div>
        <div className='mt-12 text-center text-xs'>
          <p className='mb-1'>{t('address')}</p>
          <p className='mb-1'>{t('content management')}</p>
          <p className='mb-1'>{t('business code')}</p>
          <p className='mb-1'>{t('© 2015 - Copyright owned by Cao Nam')}</p>
        </div>
      </div>
    </footer>
  )
}
