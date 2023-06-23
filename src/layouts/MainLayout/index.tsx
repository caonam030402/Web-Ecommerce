import { useEffect, useState } from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

import { BeatLoader } from 'react-spinners'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div>
      <Header />
      {loading && (
        <div className='fixed inset-0 z-30 h-full w-full bg-white/100 transition-all'>
          <BeatLoader
            size={10}
            color='#ee4d2d'
            className='absolute left-[50%] top-[50%] z-20 translate-x-[-50%] translate-y-[50%]'
          />
        </div>
      )}
      {children}
      <Footer />
    </div>
  )
}
