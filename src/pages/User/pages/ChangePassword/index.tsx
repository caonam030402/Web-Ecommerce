import Input from 'src/components/Input'
import { useForm } from 'react-hook-form'
import { UserSchema, userSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { userApi } from 'src/apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { ErrorResponse } from 'src/types/utils.type'
import omit from 'lodash/omit'
import Button from 'src/components/Button'
import { isAxiosUnprocessableEntityError } from 'src/utils/auth'
import { useTranslation } from 'react-i18next'

type FormData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>
const profileSchema = userSchema.pick(['confirm_password', 'password', 'new_password'])

export default function ChangePassword() {
  const { t } = useTranslation('user')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm<FormData>({
    defaultValues: {
      confirm_password: '',
      new_password: '',
      password: ''
    },
    resolver: yupResolver(profileSchema)
  })

  const updateProfileMutation = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      const isError = isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)
      if (isError) {
        const formError = error.response?.data.data
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

  const checkInputEmpty = () => {
    const valueInput = watch('password') && watch('confirm_password') && watch('new_password')
    if (valueInput !== '') {
      return false
    }
    return true
  }

  return (
    <div className='bg-white p-7 text-gray-700 shadow-sm'>
      <div className='mb-1 text-xl capitalize'>{t('changPassword.add password')}</div>
      <div>{t('changPassword.for account security, please do not share your password with others')}</div>
      <div className='my-4 h-[1px] w-full bg-slate-100 md:my-8'></div>
      <div className='grid grid-cols-12 md:gap-9'>
        <form className='col-span-12 gap-8 md:col-span-8' action='' onSubmit={onSubmit}>
          <table className='w-full'>
            <tbody>
              <tr className=''>
                <td className='hidden pr-[20px] text-right capitalize md:block'>{t('changPassword.old password')}</td>
                <td className='w-full md:w-[75%]'>
                  <div className='align-items 2px h-[40px] w-full'>
                    <Input
                      register={register}
                      errorMessage={errors.password?.message}
                      name='password'
                      placeholder={t('changPassword.old password')}
                      className='w-full'
                      type='password'
                      isEyePassword={true}
                      classNameInput='placeholder:capitalize w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                    />
                  </div>
                </td>
              </tr>
              <tr className=''>
                <td className='hidden pr-[20px] text-right capitalize md:block'>{t('changPassword.new password')}</td>
                <td className='w-[75%]'>
                  <div className='align-items 2px h-[40px] w-full'>
                    <Input
                      errorMessage={errors.new_password?.message}
                      register={register}
                      name='new_password'
                      placeholder={t('changPassword.new password')}
                      className='w-full'
                      type='password'
                      isEyePassword={true}
                      classNameInput='placeholder:capitalize w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                    />
                  </div>
                </td>
              </tr>
              <tr className=''>
                <td className='hidden pr-[20px] text-right capitalize md:block'>
                  {t('changPassword.confirm password')}
                </td>
                <td className='w-[75%]'>
                  <div className='align-items 2px h-[40px] w-full'>
                    <Input
                      errorMessage={errors.confirm_password?.message}
                      register={register}
                      name='confirm_password'
                      type='password'
                      placeholder={t('changPassword.confirm password')}
                      className='w-full'
                      isEyePassword={true}
                      classNameInput='placeholder:capitalize w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className='hidden md:block'></td>
                <td className='p-0'>
                  <Button
                    disabled={updateProfileMutation.isLoading || checkInputEmpty()}
                    type='submit'
                    className='rounded-sm bg-primaryColor px-5 py-2 text-white'
                  >
                    {t('save')}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className='col-span-4 hidden md:block'></div>
      </div>
    </div>
  )
}
