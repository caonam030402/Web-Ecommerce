import {
  useFloating,
  FloatingPortal,
  arrow,
  shift,
  offset,
  type Placement,
  autoUpdate,
  computePosition
} from '@floating-ui/react'
import { useState, useRef, useId, ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './style.scss'

type arrowPostion = 'arrowTop' | 'arrowBottom'

// Type Props
interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  initialOpen?: boolean
  as?: ElementType
  placementArrow?: Placement
  placementFloating?: Placement
  classNameArrow?: string
  offsetTop?: number
  duration?: number
  arrowPosition?: arrowPostion
}

export default function Popover({
  children,
  className,
  renderPopover,
  as: Element = 'div',
  initialOpen,
  classNameArrow = 'arrow_popover',
  offsetTop = 10,
  duration = 0.3,
  placementArrow = 'bottom-end',
  placementFloating = 'bottom-end',
  arrowPosition = 'arrowTop'
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef<HTMLElement>(null)

  const id = useId()

  const { x, y, strategy, refs, middlewareData } = useFloating({
    middleware: [shift(), offset(offsetTop), arrow({ element: arrowRef })],
    placement: placementArrow
  })

  const floatingEl = refs.floating.current
  const referenceEl = refs.reference.current
  const checkNull = referenceEl && floatingEl !== null

  function updatePosition() {
    if (checkNull) {
      computePosition(referenceEl, floatingEl, {
        middleware: [shift(), offset(offsetTop), arrow({ element: arrowRef })],
        placement: placementFloating
      }).then(({ x, y }) => {
        if (checkNull) {
          floatingEl.style.left = `${x}px`
          floatingEl.style.top = `${y}px`
        }
      })
    }
  }

  if (checkNull) {
    autoUpdate(referenceEl, floatingEl, updatePosition)
  }

  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <FloatingPortal id={id}>
        {isOpen && (
          // Animation
          <AnimatePresence>
            <motion.div
              ref={refs.setFloating}
              style={{
                zIndex: 200,
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: duration }}
            >
              {/* Arrow midđlewareData */}
              <span
                style={{
                  left: middlewareData.arrow?.x,
                  bottom: arrowPosition === 'arrowBottom' ? -12 : '',
                  transform: arrowPosition === 'arrowBottom' ? 'rotate(180deg)' : ''
                }}
                ref={arrowRef}
                className={classNameArrow}
              ></span>
              {renderPopover}
            </motion.div>
          </AnimatePresence>
        )}
      </FloatingPortal>
    </Element>
  )
}
