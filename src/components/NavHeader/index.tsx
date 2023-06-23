import dealNotify from '../../assets/image/deal.jpg'
import { AiFillInstagram } from 'react-icons/ai'
import { FaFacebook } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Popover from '../Popover'
import { MdLanguage, MdNotificationsNone } from 'react-icons/md'
import { BiHelpCircle } from 'react-icons/bi'
import { path } from 'src/constants/path'
import { useContext, useEffect } from 'react'
import { AppContext } from '../../Contexts/app.contexts'
import { useTranslation } from 'react-i18next'
import { getLanguageFromLS, locales, setLanguageToLS } from 'src/i18n/i18n'
import Account from '../Account'

export default function NavHeader() {
  const { isAuthenticated } = useContext(AppContext)
  const { i18n, t } = useTranslation('header')
  const currentLanguage = locales[i18n.language as keyof typeof locales]

  useEffect(() => {
    const lng = getLanguageFromLS()
    lng && i18n.changeLanguage(lng)
  }, [i18n])

  const changeLanguage = (lng: 'en' | 'vi') => {
    setLanguageToLS(lng)
    i18n.changeLanguage(lng)
  }

  return (
    <div className='hidden justify-between text-[13px] font-normal lg:flex'>
      <div className='flex items-center gap-5'>
        <Link to=''>{t('navHeader.merchant channels')}</Link>
        <Link to=''>{t('navHeader.become a Shopee Seller')}</Link>

        <div>
          <div className='flex items-center'>
            <span className='mr-[4px] capitalize'>{t('navHeader.flow us on')}</span>
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
          className='md flex items-center'
          renderPopover={
            <div className='rounded-sm bg-white shadow-sm'>
              <h1 className='p-3 text-gray-400'>{t('navHeader.new notifications received')}</h1>
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
                <p className='py-3 text-center capitalize hover:bg-gray-50'>{t('navHeader.view all')}</p>
              </Link>
            </div>
          }
        >
          <MdNotificationsNone className='mr-[2px] text-[22px]' />
          <span className='cursor-pointer'>{t('navHeader.noitifications')}</span>
        </Popover>
        <Link className='flex items-center' to=''>
          <BiHelpCircle className='mr-[2px] text-[20px]' />
          <span>{t('navHeader.help')}</span>
        </Link>
        {/* Popover Language */}
        <Popover
          renderPopover={
            <div className='flex flex-col items-start rounded-sm bg-white shadow-xl'>
              <button onClick={() => changeLanguage('vi')} className='py-2 pr-20 pl-3 hover:text-primaryColor'>
                Tiếng Việt
              </button>
              <button onClick={() => changeLanguage('en')} className='py-2 pr-20 pl-3 hover:text-primaryColor'>
                English
              </button>
            </div>
          }
          className='flex cursor-pointer items-center'
        >
          <MdLanguage className='mr-[2px] text-xl' />
          <span>{currentLanguage}</span>
        </Popover>

        {/* Popover Login */}
        {isAuthenticated ? (
          <Account pathTo={path.profile} />
        ) : (
          <div>
            <Link className='mr-5' to={path.login}>
              {t('navHeader.login')}
            </Link>
            <Link to={path.register}>{t('navHeader.register')}</Link>
          </div>
        )}
      </div>
    </div>
  )
}
