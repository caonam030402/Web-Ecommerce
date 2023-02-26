import { useFloating, FloatingPortal, arrow, shift, offset } from '@floating-ui/react'
import { useState, useRef, useId, ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './style.scss'

// Type Props
interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  initialOpen?: boolean
  as?: ElementType
}

export default function Popover({ children, className, renderPopover, as: Element = 'div', initialOpen }: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef<HTMLElement>(null)

  //Using useId for Popover
  const id = useId()

  const { x, y, strategy, refs, middlewareData } = useFloating({
    middleware: [shift(), offset(10), arrow({ element: arrowRef })]
  })
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
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Arrow midđlewareData */}
              <span
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
                ref={arrowRef}
                className='arrow_popover '
              ></span>
              {renderPopover}
            </motion.div>
          </AnimatePresence>
        )}
      </FloatingPortal>
    </Element>
  )
}
