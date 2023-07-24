import { InputHTMLAttributes, useState } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  isEyePassword?: boolean
}

export default function Input({
  errorMessage,
  register,
  rules,
  name,
  classNameInput = 'w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700',
  classNameError = 'mt-1 min-h-[1rem] text-xs text-red-600',
  className,
  isEyePassword = false,
  ...rest
}: Props) {
  const [openEye, setOpenEye] = useState(false)
  const registerResult = register && name ? register(name, rules) : {}

  const toggleEye = () => {
    setOpenEye((prev) => !prev)
  }

  const handleType = () => {
    if (rest.type === 'password') {
      return openEye ? 'text' : 'password'
    }
    return rest.type
  }

  return (
    <div>
      <div className={`${className} ${isEyePassword && 'relative'}`}>
        <input
          className={`${classNameInput} ${
            errorMessage && 'bg-red- border-red-600 bg-red-700/10 outline focus:border-red-700'
          }`}
          {...registerResult}
          {...rest}
          type={handleType()}
        />
        {rest.type === 'password' && isEyePassword && !openEye && (
          <BsEyeSlash
            onClick={toggleEye}
            className='absolute right-[3%] top-[50%] translate-y-[-50%] cursor-pointer text-lg'
          />
        )}
        {rest.type === 'password' && isEyePassword && openEye && (
          <BsEye
            onClick={toggleEye}
            className='absolute right-[3%] top-[50%] translate-y-[-50%] cursor-pointer text-base'
          />
        )}
      </div>
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
