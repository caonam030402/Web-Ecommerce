import range from 'lodash/range'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ errorMessage, onChange, value }: Props) {
  const { t } = useTranslation('user')
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }

    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
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
              {t('Profile.month')} {item + 1}
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
      <div className='mt-1 text-xs text-red-600 '>{errorMessage}</div>
    </div>
  )
}
