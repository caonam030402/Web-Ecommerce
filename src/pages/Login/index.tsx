import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <section className='grid grid-cols-1 gap-52 bg-white py-24 px-6 lg:grid-cols-2 lg:bg-primaryColor lg:px-60'>
      <div className='mx-auto hidden lg:block'></div>
      <form className='col-span-1 mx-auto flex w-[100%] flex-col rounded-sm bg-white p-5' onSubmit={onSubmit}>
        <h1 className='mb-7 text-xl'>Đăng nhập</h1>
        <input
          className='-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700'
          type='text'
          placeholder='Email'
        />
        <div className='mt-1 min-h-[1rem] text-sm text-red-600'></div>
        <input
          className='mt-4 max-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700'
          type='text'
          placeholder='Password'
        />
        <div className='mt-1 min-h-[1rem] text-sm text-red-600'></div>
        <button type='submit' className='mt-4 rounded-sm bg-primaryColor p-[10px] text-sm text-white'>
          ĐĂNG NHẬP
        </button>
        <div className='mx-auto mt-5'>
          <span className='text-gray-400'>Bạn mới biết đến Shopee?</span>
          <Link className='ml-1 text-primaryColor' to='/register'>
            Đăng ký
          </Link>
        </div>
      </form>
    </section>
  )
}
