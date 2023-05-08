import { range } from 'lodash'
import React, { useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ errorMessage, onChange, value }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target
    const newDate = {
      ...date,
      [name]: value
    }

    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
    console.log(onChange)
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <select
          className='h-10 w-[32%] rounded-sm border-[1px] border-slate-300 outline-none focus:border-[1px] focus:border-primaryColor'
          name='date'
          id=''
          onChange={handleChange}
          value={value?.getDate() || date.date}
        >
          {range(1, 32).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className='h-10 w-[32%] rounded-sm border-[1px] border-slate-300 outline-none focus:border-[1px] focus:border-primaryColor'
          name='month'
          id=''
          onChange={handleChange}
          value={value?.getMonth() || date.month}
        >
          {range(0, 12).map((item) => (
            <option value={item} key={item}>
              Tháng {item + 1}
            </option>
          ))}
        </select>
        <select
          className='h-10 w-[32%] rounded-sm border-[1px] border-slate-300 outline-none focus:border-[1px] focus:border-primaryColor'
          name='year'
          onChange={handleChange}
          value={value?.getFullYear() || date.year}
        >
          {range(1990, 2024).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className='mt-1 min-h-[1rem] text-xs text-red-600 '>{errorMessage}</div>
    </div>
  )
}
