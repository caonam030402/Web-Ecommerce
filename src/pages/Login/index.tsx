import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'email' | 'password'> // Pick the fields from Schema object which we want to keep
const LoginSchema = schema.pick(['email', 'password']) // Create a new object with those selected fields

export default function Login() {
  // register new form using useFormhook
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(LoginSchema)
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <section className='grid grid-cols-1 gap-52 bg-white py-24 px-6 lg:grid-cols-2 lg:bg-primaryColor lg:px-60'>
      <div className='mx-auto hidden lg:block'></div>
      <form className='col-span-1 mx-auto flex w-[100%] flex-col rounded-sm bg-white p-5' onSubmit={onSubmit}>
        <h1 className='text-xl'>Đăng nhập</h1>
        <Input
          name='email'
          register={register}
          className='mt-8'
          errorMassage={errors.email?.message}
          placeholder='Email'
        />
        <Input
          name='password'
          register={register}
          className='mt-4'
          errorMassage={errors.password?.message}
          placeholder='Password'
          type='password'
        />
        <button type='submit' className='mt-5 rounded-sm bg-primaryColor p-[10px] text-sm text-white'>
          ĐĂNG NHẬP
        </button>
        <div className='mx-auto mt-6'>
          <span className='text-gray-400'>Bạn mới biết đến Shopee?</span>
          <Link className='ml-1 text-primaryColor' to='/register'>
            Đăng ký
          </Link>
        </div>
      </form>
    </section>
  )
}
