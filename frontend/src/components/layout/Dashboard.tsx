const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-100">
            <span className="text-sm font-medium">Funcionario</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard PQRS
            </h1>
            <p className="text-gray-600">
              Sistema Unificado con Agentic RAG - Interfaz en Desarrollo
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 font-bold">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">PQRS Totales</p>
                  <p className="text-2xl font-bold text-gray-900">51,588</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 font-bold">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Personal Activo</p>
                  <p className="text-2xl font-bold text-gray-900">21</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600 font-bold">🚗</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vehículos</p>
                  <p className="text-2xl font-bold text-gray-900">20</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultas</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Búsqueda inteligente de PQRS por radicado o contenido
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Explorar
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Asignaciones</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Asignación automática de personal por zona geográfica
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Explorar
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Métricas</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Dashboard ejecutivo con KPIs y estadísticas
                </p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Explorar
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Asistente IA</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Consultas inteligentes con procesamiento de lenguaje natural
                </p>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                  Explorar
                </button>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Backend API: Operativo</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Base de Datos: Conectada</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Interfaz: En Desarrollo</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard