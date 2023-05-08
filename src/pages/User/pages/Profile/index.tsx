import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { userApi } from 'src/apis/user.api'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'date_of_birth' | 'avatar' | 'phone'>
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    setError,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })

  const profile = profileData?.data.data

  const updateProfileMutation = useMutation(userApi.updateProfile)

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    // await updateProfileMutation.mutateAsync({})
  })

  return (
    <div className='bg-white p-7 text-gray-700'>
      <div className='mb-1 text-xl'>Hồ sơ của tôi</div>
      <div>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      <div className='my-8 h-[1px] w-full bg-slate-100'></div>
      <div className='grid grid-cols-12 gap-9'>
        <form className='col-span-8 gap-8' action='' onSubmit={onSubmit}>
          <table className='w-full'>
            <tbody>
              <tr>
                <td className='text-right'>Email</td>
                <td>{profile?.email}</td>
              </tr>
              <tr className=''>
                <td className='text-right'>Tên</td>
                <td className='w-[75%]'>
                  <div className='align-items 2px h-[40px] w-full'>
                    <Input
                      register={register}
                      name='name'
                      placeholder='Tên'
                      errorMessage={errors.name?.message}
                      className='w-full'
                      type='text'
                      classNameInput='w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                    />
                  </div>
                </td>
              </tr>
              <tr className=''>
                <td className='text-right'>Số Điện Thoại</td>
                <td className='w-[75%]'>
                  <div className='align-items 2px flex h-[40px] w-full'>
                    <Controller
                      control={control}
                      name='phone'
                      render={({ field }) => (
                        <InputNumber
                          placeholder='Số Điện Thoại'
                          errorMessage={errors.phone?.message}
                          className='w-full'
                          classNameInput='w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                          {...field}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </td>
              </tr>
              <tr className=''>
                <td className='text-right'>Địa Chỉ</td>
                <td className='w-[75%]'>
                  <div className='align-items 2px flex h-[40px] w-full'>
                    <Input
                      register={register}
                      name='address'
                      placeholder='Địa chỉ'
                      className='w-full'
                      type='text'
                      classNameInput='w-full flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                      errorMessage={errors.address?.message}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className='text-right'>Ngày sinh</td>
                <td>
                  <Controller
                    control={control}
                    name='date_of_birth'
                    render={({ field }) => (
                      <DateSelect
                        errorMessage={errors.date_of_birth?.message}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td className='p-0'>
                  <button type='submit' className='rounded-sm bg-primaryColor px-5 py-2 text-white'>
                    Lưu
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className='col-span-4 '>
          <div className='border-l-[1px] border-slate-200'>
            <div className='flex flex-col items-center justify-center px-14 py-6'>
              <img
                src='https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/325943176_1141910926526874_1884396859380038867_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=wgGjK5WTTLUAX_GDlQs&_nc_ht=scontent.fdad3-5.fna&oh=00_AfAa2EzN9kp8srMqAUr4X6ZRZZxV5cS3-dqpLNeExF1MAQ&oe=645D0E58'
                alt=''
                className='h-[100px] w-[100px] rounded-full'
              />
              <input accept='.png,.jpeg,.jpg' type='file' className='hidden' />
              <button type='button' className='my-3 border-[1px] border-slate-300 px-4 py-2'>
                Chọn ảnh
              </button>
              <p>Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
