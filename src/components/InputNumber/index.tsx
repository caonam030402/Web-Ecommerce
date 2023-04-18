import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMassage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    classNameInput = 'w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700',
    className,
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const regaxNumber = /^[0-9]+$/
    if (regaxNumber.test(value) || value === '') {
      onChange && onChange(event)
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input className={classNameInput} {...rest} value={value || localValue} onChange={handleChange} ref={ref} />
    </div>
  )
})

export default InputNumber
