import { VscAdd, VscChromeMinimize } from 'react-icons/vsc'
import InputNumber, { InputNumberProps } from '../InputNumber'
import { useState } from 'react'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  value,
  classNameWrapper = '',
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState<number>(Number(value || 1))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }
    onType && onType(_value)
    setLocalValue(_value)
  }

  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const _value = Number(event.target.value)
    onFocusOut && onFocusOut(_value)
  }

  return (
    <div className='mb-0'>
      <div className={'flex justify-center' + classNameWrapper}>
        <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
          <VscChromeMinimize onClick={decrease} />
        </button>
        <InputNumber
          onBlur={handleBlur}
          value={value || localValue}
          classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
          onChange={handleChange}
          classNameError='hidden'
          {...rest}
        ></InputNumber>
        <button
          onClick={increase}
          className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600 '
        >
          <VscAdd />
        </button>
      </div>
    </div>
  )
}
