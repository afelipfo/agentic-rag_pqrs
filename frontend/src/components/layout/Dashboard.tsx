import { useState, Suspense, lazy } from 'react'
import { Search, Users, BarChart3, MessageSquare, Menu, X, Loader2 } from 'lucide-react'
import { Button } from '../common/Button'

// Lazy loading de módulos para mejor performance
const QueryModule = lazy(() => import('../modules/QueryModule'))
const AssignmentModule = lazy(() => import('../modules/AssignmentModule'))
const MetricsModule = lazy(() => import('../modules/MetricsModule'))
const ChatWidget = lazy(() => import('../common/ChatWidget'))

// Componente de loading para lazy loading
const ModuleLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p className="text-gray-600">Cargando módulo...</p>
    </div>
  </div>
)

type ModuleType = 'query' | 'assignment' | 'metrics' | 'chat'

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('query')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const modules = [
    { id: 'query' as ModuleType, name: 'Consultas', icon: Search, component: QueryModule },
    { id: 'assignment' as ModuleType, name: 'Asignaciones', icon: Users, component: AssignmentModule },
    { id: 'metrics' as ModuleType, name: 'Métricas', icon: BarChart3, component: MetricsModule },
  ]

  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || QueryModule

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Links for Accessibility */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <a href="#navigation" className="skip-link">
        Saltar a la navegación
      </a>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PQRS</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Sistema PQRS Medellín
                </h1>
                <p className="text-xs text-gray-500">
                  Gestión Inteligente de Peticiones
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-100">
            <span className="text-sm font-medium">Funcionario</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          id="navigation"
          className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-200"
          role="navigation"
          aria-label="Navegación principal"
        >
          <nav className="flex-1 px-4 py-6 space-y-2">
            {modules.map((module) => {
              const Icon = module.icon
              const isActive = activeModule === module.id

              return (
                <Button
                  key={module.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {module.name}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Menú</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
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
                  className={`w-full justify-start ${
                    isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveModule(module.id)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {module.name}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-6 lg:ml-64" role="main">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<ModuleLoader />}>
              <ActiveComponent />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default Dashboard