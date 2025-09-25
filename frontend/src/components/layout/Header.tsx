import { Menu, Bell, User } from 'lucide-react'
import { Button } from '../common/Button'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gov-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PQRS</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Sistema PQRS Medellín
              </h1>
              <p className="text-xs text-muted-foreground">
                Gestión Inteligente de Peticiones
              </p>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Funcionario</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header