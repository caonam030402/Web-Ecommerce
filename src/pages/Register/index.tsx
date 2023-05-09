import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { authApi } from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/components/Contexts/app.contexts'
import Button from 'src/components/Button'
import { path } from 'src/constants/path'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'> // Pick the fields from Schema type which are required
const registerSchema = schema.pick(['email', 'password', 'confirm_password']) // Create a new schema with only picked fields

export default function Register() {
  // register new form using useFormhook
  const {
    register,
    handleSubmit,
    setError,
    watch,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const checkInputEmpty = () => {
    const valueInput = (watch('password') && watch('email')) || (getValues('password') && getValues('email'))
    if (valueInput !== '') {
      return false
    }
    return true
  }

  // useContext
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  // useMutation ReactQuery
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  //Navigate
  const navigate = useNavigate()

  // Submit the form
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (errors) => {
        const isError = isAxiosUnprocessableEntity<ErrorResponse<Omit<FormData, 'confirm_password'>>>(errors)
        if (isError) {
          const formError = errors.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <section className='grid grid-cols-1 gap-52 bg-primaryColor py-24 px-6 lg:grid-cols-2 lg:px-60'>
      <div className='mx-auto hidden lg:block'></div>
      <form className='col-span-1 mx-auto flex w-[100%] flex-col rounded-sm bg-white p-5' onSubmit={onSubmit}>
        <h1 className=' text-xl'>Đăng ký</h1>
        <Input
          name='email'
          register={register}
          className='mt-8'
          errorMessage={errors.email?.message}
          placeholder='Email'
        />
        <Input
          name='password'
          register={register}
          className='mt-3'
          errorMessage={errors.password?.message}
          placeholder='Password'
          type='password'
          isEyePassword={true}
        />
        <Input
          name='confirm_password'
          register={register}
          className='mt-3'
          errorMessage={errors.confirm_password?.message}
          placeholder='Confirm Password'
          type='password'
          isEyePassword={true}
        />
        <Button
          disabled={registerAccountMutation.isLoading || checkInputEmpty()}
          isLoading={registerAccountMutation.isLoading || checkInputEmpty()}
          type='submit'
          className='mt-4 flex items-center justify-center rounded-sm bg-primaryColor p-[10px] text-sm text-white'
        >
          ĐĂNG KÍ
        </Button>
        <div className='mx-auto mt-3'>
          <span className='text-gray-400'>Bạn đã có tài khoản?</span>
          <Link className='ml-1 text-primaryColor' to={path.login}>
            Đăng nhập
          </Link>
        </div>
      </form>
    </section>
  )
}
