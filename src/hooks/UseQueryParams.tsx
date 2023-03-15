import { useSearchParams } from 'react-router-dom'

export default function UseQueryParams() {
  const [seacrhParams] = useSearchParams()
  return Object.fromEntries([...seacrhParams])
}
