import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { authApi } from 'src/apis/auth.api'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/Contexts/app.contexts'
import Button from 'src/components/Button'
import { path } from 'src/constants/path'
import { isAxiosUnprocessableEntityError } from 'src/utils/auth'
import { useTranslation } from 'react-i18next'

type FormData = Pick<Schema, 'email' | 'password'> // Pick the fields from Schema object which we want to keep
const LoginSchema = schema.pick(['email', 'password']) // Create a new object with those selected fields

export default function Login() {
  const { t } = useTranslation('header')

  // register new form using useFormhook
  const {
    register,
    handleSubmit,
    setError,
    watch,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(LoginSchema)
  })

  const checkInputEmpty = () => {
    const valueInput = (watch('password') && watch('email')) || (getValues('password') && getValues('email'))
    if (valueInput !== '') {
      return false
    }
    return true
  }

  // useMutation ReactQuery
  const loginMutation = useMutation({ mutationFn: (body: FormData) => authApi.login(body) })
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  // onsubmit form
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (errors) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(errors)) {
          const formError = errors.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <section className='grid grid-cols-1 gap-52 bg-white py-24 px-6 lg:grid-cols-2 lg:bg-primaryColor lg:px-60'>
      <div className='mx-auto hidden lg:block'></div>
      <form className='col-span-1 mx-auto flex w-[100%] flex-col rounded-sm bg-white p-5' onSubmit={onSubmit}>
        <h1 className='text-xl capitalize'>{t('navHeader.login')}</h1>
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
          className='mt-4'
          errorMessage={errors.password?.message}
          placeholder='Password'
          type='password'
          isEyePassword={true}
        />
        <Button
          disabled={loginMutation.isLoading || checkInputEmpty()}
          isLoading={loginMutation.isLoading || checkInputEmpty()}
          type='submit'
          className='mt-4 flex items-center justify-center rounded-sm bg-primaryColor p-[10px] text-sm uppercase text-white'
        >
          {t('navHeader.login')}
        </Button>
        <div className='mx-auto mt-6'>
          <span className='text-gray-400'>{t('navHeader.new to Shopee?')}</span>
          <Link className='ml-1 text-primaryColor' to={path.register}>
            {t('navHeader.register')}
          </Link>
        </div>
      </form>
    </section>
  )
}
