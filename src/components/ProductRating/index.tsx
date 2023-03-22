import { BsStarFill } from 'react-icons/bs'

export default function ProductRating({
  rating,
  activeClassName = 'mr-[2px] text-[10px] text-yellow-400',
  noActiveClassName = 'mr-[2px] text-[10px] text-gray-300'
}: {
  rating: number
  activeClassName?: string
  noActiveClassName?: string
}) {
  const handleWithStar = (order: number) => {
    if (order <= rating) {
      return '100%'
    }
    if (order > rating && order - rating < 1) {
      return (rating - Math.floor(rating)) * 100 + '%'
    }
    return '0%'
  }
  return (
    <div className='flex items-center gap-[2px]'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className='relative '>
            <div style={{ width: handleWithStar(index + 1) }} className='absolute left-0 top-0 h-full overflow-hidden'>
              <BsStarFill className={activeClassName} />
            </div>
            <BsStarFill className={noActiveClassName} />
          </div>
        ))}
    </div>
  )
}
