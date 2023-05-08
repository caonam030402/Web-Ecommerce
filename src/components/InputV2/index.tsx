import { InputHTMLAttributes, useState } from 'react'
import { FieldValues, useController, UseControllerProps, FieldPath } from 'react-hook-form'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
}

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputNumberProps) {
  const {
    type,
    onChange,
    classNameInput = 'w-full rounded-sm border-[0.5px] border-gray-300 py-2 px-3 outline-none focus:border-gray-700',
    className,
    value = '',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regaxNumber = /^[0-9]+$/
    const valueFromInput = event.target.value
    const numberCondition = (type === 'number' && regaxNumber.test(valueFromInput)) || valueFromInput === ''

    if (numberCondition || type !== 'number') {
      setLocalValue(valueFromInput)
      field.onChange(event)
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} onChange={handleChange} value={value || localValue} />
    </div>
  )
}

export default InputV2
