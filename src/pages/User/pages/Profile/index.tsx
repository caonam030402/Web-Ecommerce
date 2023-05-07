export default function Profile() {
  return (
    <div className='bg-white p-7 text-gray-700'>
      <div className='mb-1 text-xl'>Hồ sơ của tôi</div>
      <div>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      <div className='my-8 h-[1px] w-full bg-slate-100'></div>
      <div className='grid grid-cols-12 gap-9'>
        <form className='col-span-8 gap-8' action=''>
          <table className='w-full'>
            <tr>
              <td className='text-right'>Email</td>
              <td>caonamhhh</td>
            </tr>
            <tr className=''>
              <td className='text-right'>Tên</td>
              <td className='w-[75%]'>
                <div className='align-items 2px flex h-[40px] w-full'>
                  <input
                    type='text'
                    className='flex-1 flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                  />
                </div>
              </td>
            </tr>
            <tr className=''>
              <td className='text-right'>Số Điện Thoại</td>
              <td className='w-[75%]'>
                <div className='align-items 2px flex h-[40px] w-full'>
                  <input
                    type='text'
                    className='flex-1 flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                  />
                </div>
              </td>
            </tr>
            <tr className=''>
              <td className='text-right'>Địa Chỉ</td>
              <td className='w-[75%]'>
                <div className='align-items 2px flex h-[40px] w-full'>
                  <input
                    type='text'
                    className='flex-1 flex-shrink-0 rounded-sm border-[1px] border-slate-300 px-2 py-2 outline-none'
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className='text-right'>Ngày sinh</td>
              <td>
                <div className='flex items-center justify-between'>
                  <select className='h-10 w-[32%] rounded-sm border-[1px] border-slate-300' name='' id=''>
                    <option disabled>Ngày</option>
                  </select>
                  <select className='h-10 w-[32%] rounded-sm border-[1px] border-slate-300' name='' id=''>
                    <option disabled>Thángs</option>
                  </select>
                  <select className='h-10 w-[32%] rounded-sm border-[1px] border-slate-300' name='' id=''>
                    <option disabled>Năm</option>
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td className='p-0'>
                <button className='rounded-sm bg-primaryColor px-5 py-2 text-white'>Lưu</button>
              </td>
            </tr>
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
              <button className='my-3 border-[1px] border-slate-300 px-4 py-2'>Chọn ảnh</button>
              <p>Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
