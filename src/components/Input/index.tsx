import { InputHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMassage?: string
  classNameInput?: string
  classNameError?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  type,
  register,
  errorMassage,
  placeholder,
  rules,
  name,
  classNameInput = 'w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3  outline-none focus:border-gray-700',
  classNameError = 'mt-1 min-h-[1rem] text-xs text-red-600',
  className
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input className={classNameInput} type={type} placeholder={placeholder} {...registerResult} />
      <div className={classNameError}>{errorMassage}</div>
    </div>
  )
}
