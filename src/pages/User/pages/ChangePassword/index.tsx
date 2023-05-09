import Input from 'src/components/Input'
import { useForm } from 'react-hook-form'
import { UserSchema, userSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { userApi } from 'src/apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { omit } from 'lodash'
import Button from 'src/components/Button'

type FormData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>
const profileSchema = userSchema.pick(['confirm_password', 'password', 'new_password'])

export default function ChangePassword() {
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
      console.log(res)
      toast.success(res.data.message)
      reset()
    } catch (error) {
      const isError = isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)
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
    <div className='bg-white p-7 text-gray-700 transition-all'>
      <div className='mb-1 text-xl'>Hồ sơ của tôi</div>
      <div>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      <div className='my-8 h-[1px] w-full bg-slate-100'></div>
      <div className='grid grid-cols-12 gap-9'>
        <form className='col-span-8 gap-8' action='' onSubmit={onSubmit}>
          <table className='w-full'>
            <tbody>
              <tr className=''>
                <td className='text-right'>Mật Khẩu Cũ</td>
                <td className='w-[75%]'>
                  <div className='align-items 2px h-[40px] w-full'>
                    <Input
                      register={register}
                      errorMessage={errors.password?.message}
                      name='password'
                      placeholder='Mật Khẩu Cũ'
                      className='w-full'
                      type='password'
                      isEyePassword={true}
                      classNameInput='w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                    />
                  </div>
                </td>
              </tr>
              <tr className=''>
                <td className='text-right'>Mật Khẩu Mới</td>
                <td className='w-[75%]'>
                  <div className='align-items 2px h-[40px] w-full'>
                    <Input
                      errorMessage={errors.new_password?.message}
                      register={register}
                      name='new_password'
                      placeholder='Mật Khẩu Mới'
                      className='w-full'
                      type='password'
                      isEyePassword={true}
                      classNameInput='w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                    />
                  </div>
                </td>
              </tr>
              <tr className=''>
                <td className='text-right'>Xác nhận mật khẩu</td>
                <td className='w-[75%]'>
                  <div className='align-items 2px h-[40px] w-full'>
                    <Input
                      errorMessage={errors.confirm_password?.message}
                      register={register}
                      name='confirm_password'
                      type='password'
                      placeholder='Xác nhận mật khẩu'
                      className='w-full'
                      isEyePassword={true}
                      classNameInput='w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td className='p-0'>
                  <Button
                    disabled={updateProfileMutation.isLoading || checkInputEmpty()}
                    type='submit'
                    className='rounded-sm bg-primaryColor px-5 py-2 text-white'
                  >
                    Lưu
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className='col-span-4 '></div>
      </div>
    </div>
  )
}
