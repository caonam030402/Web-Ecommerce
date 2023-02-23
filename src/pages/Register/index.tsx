import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <section className='grid grid-cols-1 gap-52 bg-primaryColor py-24 px-6 lg:grid-cols-2 lg:px-60'>
      <div className='mx-auto hidden lg:block'></div>
      <form className='col-span-1 mx-auto flex w-[100%] flex-col rounded-sm bg-white p-5'>
        <h1 className='mb-7 text-xl'>Đăng ký</h1>
        <input
          className='-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700'
          type='text'
          placeholder='Email'
        />
        <input
          className='mt-8 max-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700'
          type='text'
          placeholder='Password'
        />
        <input
          className='mt-8 max-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700'
          type='text'
          placeholder='Confirm Password'
        />
        <button className='mt-8 rounded-sm bg-primaryColor p-[10px] text-sm text-white'>ĐĂNG NHẬP</button>
        <div className='mx-auto mt-5'>
          <span className='text-gray-400'>Bạn đã có tài khoản?</span>
          <Link className='ml-1 text-primaryColor' to='/login'>
            Đăng nhập
          </Link>
        </div>
      </form>
    </section>
  )
}
