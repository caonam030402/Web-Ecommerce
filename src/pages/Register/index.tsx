import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getRules } from 'src/utils/rules'

// interface for FormData
interface FormData {
  email: string
  password: string
  confirm_password: string
}

export default function Register() {
  // register new form using useFormhook
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>()

  // Get Rules
  const rules = getRules(getValues)

  // Submit the form
  const onSubmit = handleSubmit(
    (data) => {
      console.log(data)
    },
    (data) => {
      const password = getValues('password')
      console.log(password)
    }
  )

  return (
    <section className='grid grid-cols-1 gap-52 bg-primaryColor py-24 px-6 lg:grid-cols-2 lg:px-60'>
      <div className='mx-auto hidden lg:block'></div>
      <form className='col-span-1 mx-auto flex w-[100%] flex-col rounded-sm bg-white p-5' onSubmit={onSubmit}>
        <h1 className='mb-7 text-xl'>Đăng ký</h1>
        <input
          className='-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3  outline-none focus:border-gray-700'
          type='email'
          placeholder='Email'
          {...register('email', rules.email)}
        />
        <div className=' mt-1 min-h-[1rem] text-xs text-red-600'>{errors.email?.message}</div>
        <input
          className='mt-4 max-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700'
          type='password'
          placeholder='Password'
          {...register('password', rules.password)}
        />
        <div className=' mt-1 min-h-[1rem] text-xs text-red-600'>{errors.password?.message}</div>
        <input
          className='mt-4 max-w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700'
          type='password'
          placeholder='Confirm Password'
          {...register('confirm_password', {
            ...rules.confirm_password,
            validate: (value) => value === getValues('password') || 'Password không khớp'
          })}
        />
        <div className=' mt-1 min-h-[1rem] text-xs text-red-600'>{errors.confirm_password?.message}</div>
        <button type='submit' className='mt-4 rounded-sm bg-primaryColor p-[10px] text-sm text-white'>
          ĐĂNG NHẬP
        </button>
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
