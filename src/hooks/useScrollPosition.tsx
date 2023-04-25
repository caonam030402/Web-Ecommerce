import { useEffect, useState } from 'react'

export default function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(false)

  useEffect(() => {
    const updatePosition = () => {
      if (window.pageYOffset < 800) {
        setScrollPosition(true)
      } else {
        setScrollPosition(false)
      }
    }
    window.addEventListener('scroll', updatePosition)
    updatePosition()
    return () => window.removeEventListener('scroll', updatePosition)
  }, [])
  return scrollPosition
}
