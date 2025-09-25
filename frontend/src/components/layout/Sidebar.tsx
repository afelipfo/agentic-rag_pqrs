import { LucideIcon, X } from 'lucide-react'
import { Button } from '../common/Button'
import { cn } from '../../utils/cn'

type ModuleType = 'query' | 'assignment' | 'metrics' | 'chat'

interface Module {
  id: ModuleType
  name: string
  icon: LucideIcon
  component: React.ComponentType
}

interface SidebarProps {
  modules: Module[]
  activeModule: ModuleType
  onModuleChange: (module: ModuleType) => void
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ modules, activeModule, onModuleChange, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-card border-r border-border">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id

            return (
              <Button
                key={module.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-gov-blue text-white hover:bg-gov-blue/90"
                )}
                onClick={() => onModuleChange(module.id)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {module.name}
              </Button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out pt-16",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-semibold">Menú</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id

            return (
              <Button
                key={module.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-gov-blue text-white hover:bg-gov-blue/90"
                )}
                onClick={() => {
                  onModuleChange(module.id)
                  onClose()
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {module.name}
              </Button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar