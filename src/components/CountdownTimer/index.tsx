import { useState, useEffect } from 'react'
import moment from 'moment'

interface Time {
  hours: string
  minutes: string
  seconds: string
}

const CountdownTimer = ({ targetTime }: { targetTime: number }) => {
  const [countdown, setCountdown] = useState<Time>(calculateRemainingTime())

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateRemainingTime())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime])

  function calculateRemainingTime() {
    const now = moment()
    const distance = moment(targetTime).diff(now)
    if (distance <= 0) {
      return {
        hours: ('0' + 0).slice(-2),
        minutes: ('0' + 0).slice(-2),
        seconds: ('0' + 0).slice(-2)
      }
    } else {
      const duration = moment.duration(distance)
      const hours = duration.hours()
      const minutes = duration.minutes()
      const seconds = duration.seconds()

      return { hours: ('0' + hours).slice(-2), minutes: ('0' + minutes).slice(-2), seconds: ('0' + seconds).slice(-2) }
    }
  }

  return (
    <div className='flex gap-1 font-bold leading-4'>
      <span className='bg-black px-[3px] text-white'>{countdown?.hours}</span>
      <span className='bg-black px-[3px] text-white'>{countdown?.minutes}</span>
      <span className='bg-black px-[3px] text-white'>
        <span className=''>{countdown?.seconds}</span>
      </span>
    </div>
  )
}

export default CountdownTimer
