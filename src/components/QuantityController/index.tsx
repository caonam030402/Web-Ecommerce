import { VscAdd, VscChromeMinimize } from 'react-icons/vsc'
import InputNumber, { InputNumberProps } from '../InputNumber'
import { useState } from 'react'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  value,
  classNameWrapper = 'flex items-center border-[1px] border-r-[1px] border-gray-200',
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

  return (
    <div>
      <div className={classNameWrapper}>
        <button className='px-2 py-1'>
          <VscChromeMinimize onClick={decrease} />
        </button>
        <InputNumber
          value={value || localValue}
          classNameInput='text-base px-2 py-1 w-[60px] outline-none border-r-[1px] border-l-[1px] border-gray-200 text-center justify-center'
          onChange={handleChange}
          {...rest}
        ></InputNumber>
        <button onClick={increase} className='px-2 py-1 '>
          <VscAdd />
        </button>
      </div>
    </div>
  )
}
