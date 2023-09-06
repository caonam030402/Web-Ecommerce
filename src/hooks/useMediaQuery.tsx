import { useMediaQuery as useMediaQueryLib } from 'react-responsive'

export default function useMediaQuery() {
  const isMobile = useMediaQueryLib({ query: '(max-width: 767px)' })
  return { isMobile }
}
