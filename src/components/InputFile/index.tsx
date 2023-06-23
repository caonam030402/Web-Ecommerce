import React, { useRef } from 'react'
import { toast } from 'react-toastify'
import { config } from 'src/constants/config'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (file: File) => void
  name?: string
}

export default function InputFile({ onChange, name }: Props) {
  const { t } = useTranslation('user')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]

    if (
      (fileFromLocal && fileFromLocal.size >= config.maxSizeUploadAvartar) ||
      !fileFromLocal?.type.includes('image')
    ) {
      toast.error('Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG')
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        onChange={onFileChange}
        type='file'
        name={name}
        accept='.jpg,.jpeg,.png'
        className='hidden'
        ref={fileInputRef}
        onClick={(event) => {
          ;(event.target as any).value = null
        }}
      />
      <button onClick={handleUpload} type='button' className='my-3 border-[1px] border-slate-300 px-4 py-2'>
        {t('Profile.choose photo')}
      </button>
    </div>
  )
}
