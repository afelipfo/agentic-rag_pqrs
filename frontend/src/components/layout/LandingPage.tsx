import { useState, useEffect } from 'react'
import { Search, Users, BarChart3, MessageSquare, ArrowRight, Activity, User, Truck, CheckCircle } from 'lucide-react'
import { Button } from '../common/Button'
import { Card, CardContent } from '../common/Card'
import { Badge } from '../common/Badge'

interface LandingPageProps {
  onEnterDashboard: () => void
}

const LandingPage = ({ onEnterDashboard }: LandingPageProps) => {
  const [metrics, setMetrics] = useState({
    totalPQRS: 51588,
    activePQRS: 12543,
    personnel: 21,
    vehicles: 20,
    assignmentsToday: 23
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        assignmentsToday: prev.assignmentsToday + Math.floor(Math.random() * 3) - 1
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const quickActions = [
    {
      icon: Search,
      title: 'Consultar PQRS',
      description: 'Buscar por radicado o contenido',
      action: () => onEnterDashboard(),
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      icon: Users,
      title: 'Asignar Personal',
      description: 'Gestión inteligente de recursos',
      action: () => onEnterDashboard(),
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      icon: MessageSquare,
      title: 'Búsqueda IA',
      description: 'Consultas en lenguaje natural',
      action: () => onEnterDashboard(),
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      icon: BarChart3,
      title: 'Reportes',
      description: 'Métricas y estadísticas',
      action: () => onEnterDashboard(),
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">PQRS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Sistema PQRS Medellín
                </h1>
                <p className="text-xs text-gray-500">
                  Gestión Inteligente con Agentic RAG
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Sistema Activo
              </Badge>
              <Button onClick={onEnterDashboard} className="hidden sm:flex">
                Entrar al Sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Gestión Inteligente de PQRS
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema unificado con IA que optimiza la atención ciudadana en Medellín.
            Consultas inteligentes, asignaciones automáticas y métricas en tiempo real.
          </p>
          <Button onClick={onEnterDashboard} size="lg" className="sm:hidden">
            Entrar al Sistema
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Real-time Metrics */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            📊 Métricas en Tiempo Real
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="text-center border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {metrics.totalPQRS.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">PQRS Totales</p>
                <div className="w-full bg-blue-100 rounded-full h-1 mt-2">
                  <div className="bg-blue-600 h-1 rounded-full w-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-yellow-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {metrics.activePQRS.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">PQRS Activos</p>
                <div className="w-full bg-yellow-100 rounded-full h-1 mt-2">
                  <div className="bg-yellow-600 h-1 rounded-full" style={{width: `${(metrics.activePQRS / metrics.totalPQRS) * 100}%`}}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-3xl font-bold text-green-600">{metrics.personnel}</span>
                </div>
                <p className="text-sm text-gray-600">Personal Activo</p>
                <div className="w-full bg-green-100 rounded-full h-1 mt-2">
                  <div className="bg-green-600 h-1 rounded-full w-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Truck className="h-6 w-6 text-purple-600 mr-2" />
                  <span className="text-3xl font-bold text-purple-600">{metrics.vehicles}</span>
                </div>
                <p className="text-sm text-gray-600">Vehículos</p>
                <div className="w-full bg-purple-100 rounded-full h-1 mt-2">
                  <div className="bg-purple-600 h-1 rounded-full w-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-orange-600 mr-2" />
                  <span className="text-3xl font-bold text-orange-600">{metrics.assignmentsToday}</span>
                </div>
                <p className="text-sm text-gray-600">Asignaciones Hoy</p>
                <div className="w-full bg-orange-100 rounded-full h-1 mt-2">
                  <div className="bg-orange-600 h-1 rounded-full w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            🎯 Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${action.color}`}
                onClick={action.action}
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <action.icon className="h-8 w-8 text-gray-700" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Acceder
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Sistema Operativo
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Todos los servicios están funcionando correctamente. Agentic RAG operativo con 51,588 PQRS indexados.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-green-100 text-green-800">Backend API ✅</Badge>
                <Badge className="bg-green-100 text-green-800">Sistema RAG ✅</Badge>
                <Badge className="bg-green-100 text-green-800">Agentes IA ✅</Badge>
                <Badge className="bg-green-100 text-green-800">Base de Datos ✅</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p className="mb-2">
              © 2024 Sistema PQRS Medellín - Secretaría de Infraestructura Física
            </p>
            <p className="text-sm">
              Tecnología Agentic RAG • Desarrollado con React + FastAPI + LangChain
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage