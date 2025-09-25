import * as React from "react"

interface CollapsibleProps {
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  asChild?: boolean
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

const CollapsibleContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  className,
  open = false,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = React.useState(open)

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }, [onOpenChange])

  const currentOpen = onOpenChange ? open : internalOpen

  return (
    <CollapsibleContext.Provider value={{ open: currentOpen, onOpenChange: handleOpenChange }}>
      <div className={className}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  className,
  onClick,
  asChild = false
}) => {
  const context = React.useContext(CollapsibleContext)

  const handleClick = () => {
    if (context) {
      context.onOpenChange(!context.open)
    }
    if (onClick) {
      onClick()
    }
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      className: `${children.props.className || ''} ${className || ''}`.trim()
    })
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  )
}

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({ children, className }) => {
  const context = React.useContext(CollapsibleContext)

  if (!context?.open) {
    return null
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }