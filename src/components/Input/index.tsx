import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  type?: React.HTMLInputTypeAttribute
  errorMassage?: string
  placeholder?: string
  className?: string
  name: string
  register: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({ type, className, register, errorMassage, placeholder, rules, name }: Props) {
  return (
    <div className={className}>
      <input
        className='w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3  outline-none focus:border-gray-700'
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
      />
      <div className=' mt-1 min-h-[1rem] text-xs text-red-600'>{errorMassage}</div>
    </div>
  )
}
