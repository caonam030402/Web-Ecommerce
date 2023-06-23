import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { path } from 'src/constants/path'
import Account from '../Account'

interface Props {
  namePage?: string
}

export default function HeaderMobile({ namePage }: Props) {
  return (
    <div className='container sticky top-0 z-20 flex items-center justify-between bg-primaryColor py-3 text-white md:hidden'>
      <Link to={path.home}>
        <FiArrowLeft className='mr-2 block text-[28px] md:hidden' />
      </Link>
      <Link
        to={path.home}
        className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-base font-semibold capitalize'
      >
        {namePage}
      </Link>

      <Account pathTo={path.profile} name={false} />
    </div>
  )
}
