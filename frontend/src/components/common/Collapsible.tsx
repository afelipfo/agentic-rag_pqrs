import * as React from "react"

interface CollapsibleProps {
  children: React.ReactNode
  className?: string
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

const Collapsible: React.FC<CollapsibleProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
)

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({ children, className, onClick }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
)

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
)

export { Collapsible, CollapsibleTrigger, CollapsibleContent }