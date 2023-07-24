import { useEffect, useState } from 'react'

export default function useScrollPosition({ scrollY }: { scrollY: number }) {
  const [scrollPosition, setScrollPosition] = useState(false)

  useEffect(() => {
    const updatePosition = () => {
      if (window.scrollY < scrollY) {
        setScrollPosition(false)
      } else {
        setScrollPosition(true)
      }
    }

    window.addEventListener('scroll', updatePosition)
    return () => window.removeEventListener('scroll', updatePosition)
  }, [scrollY])
  return scrollPosition
}
