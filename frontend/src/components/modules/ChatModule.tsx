import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, RefreshCw } from 'lucide-react'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: Array<{
    label: string
    action: string
    type: 'primary' | 'secondary'
  }>
}

const ChatModule = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy el Asistente IA del Sistema PQRS de Medellín. ¿En qué puedo ayudarte hoy? Puedo buscar información sobre PQRS, hacer asignaciones de recursos, o responder preguntas sobre el sistema.',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      // Call the real API endpoint POST /api/agent/process
      const response = await fetch('http://localhost:8000/api/agent/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_type: 'chat_query',
          parameters: {
            query: inputMessage.trim(),
            session_id: 'chat_session_' + Date.now(), // Simple session management
            context: messages.slice(-5) // Last 5 messages for context
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.result?.response || data.result?.content || 'Respuesta procesada por el agente IA.',
          actions: data.result?.actions || [],
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      } else {
        // Fallback to simulated response if API fails
        console.warn('API call failed, using fallback response')
        const aiResponseData = generateAIResponse(inputMessage.trim())
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponseData.content,
          actions: aiResponseData.actions,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      }
    } catch (error) {
      console.error('Chat API error:', error)
      // Fallback to simulated response
      const aiResponseData = generateAIResponse(inputMessage.trim())
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseData.content,
        actions: aiResponseData.actions,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): { content: string; actions?: Array<{ label: string; action: string; type: 'primary' | 'secondary' }> } => {
    const input = userInput.toLowerCase()

    // Simple pattern matching for demo purposes
    if (input.includes('cuántos pqrs activos hay en comuna 1')) {
      return {
        content: 'Según los datos actuales, hay **1,250 PQRS activos** en la Comuna 1 (Popular). Esta es una de las zonas con mayor actividad en el sistema.',
        actions: [
          { label: 'Ver Detalles Comuna 1', action: 'navigate_query_comuna1', type: 'primary' },
          { label: 'Asignar Personal', action: 'navigate_assignment_comuna1', type: 'secondary' }
        ]
      }
    }

    if (input.includes('asignar personal para zona centro')) {
      return {
        content: 'Para asignar personal en la zona Centro (La Candelaria), el sistema recomienda **3 técnicos disponibles**. La zona tiene actualmente 620 PQRS activas con prioridad media-alta.',
        actions: [
          { label: 'Ver Asignaciones', action: 'navigate_assignment_centro', type: 'primary' },
          { label: 'Optimizar Rutas', action: 'view_routes_centro', type: 'secondary' }
        ]
      }
    }

    if (input.includes('buscar pqrs sobre infraestructura vial')) {
      return {
        content: 'Encontré **45 PQRS activos** relacionados con infraestructura vial en las últimas 4 semanas. Los temas más comunes son: reparación de vías, señalización vial, y baches en carreteras principales.',
        actions: [
          { label: 'Ver Resultados', action: 'navigate_query_vial', type: 'primary' },
          { label: 'Generar Reporte', action: 'generate_report_vial', type: 'secondary' }
        ]
      }
    }

    if (input.includes('pqrs') && input.includes('buscar')) {
      return {
        content: 'Para buscar PQRS específicas, puedes usar el módulo de Consultas. Te recomiendo buscar por número de radicado o usar la búsqueda inteligente con palabras clave.',
        actions: [
          { label: 'Ir a Consultas', action: 'navigate_query', type: 'primary' }
        ]
      }
    }

    if (input.includes('asignar') || input.includes('personal')) {
      return {
        content: 'Para asignar personal y vehículos a PQRS activas, utiliza el módulo de Asignaciones. El sistema utiliza IA para optimizar las asignaciones.',
        actions: [
          { label: 'Ir a Asignaciones', action: 'navigate_assignment', type: 'primary' }
        ]
      }
    }

    if (input.includes('estadística') || input.includes('métrica')) {
      return {
        content: 'El módulo de Métricas te muestra KPIs importantes como el total de PQRS, tasa de resolución, tiempo promedio de respuesta, y distribución por zonas.',
        actions: [
          { label: 'Ver Métricas', action: 'navigate_metrics', type: 'primary' }
        ]
      }
    }

    if (input.includes('ayuda') || input.includes('help')) {
      return {
        content: 'Estoy aquí para ayudarte con consultas sobre PQRS, asignaciones de recursos, métricas del sistema, y procedimientos administrativos.',
        actions: [
          { label: 'Ver Módulos', action: 'show_modules', type: 'secondary' }
        ]
      }
    }

    if (input.includes('hola') || input.includes('buenos días') || input.includes('buenas tardes')) {
      return {
        content: '¡Hola! Es un gusto atenderte. ¿En qué puedo ayudarte con el Sistema PQRS de Medellín hoy?',
        actions: [
          { label: 'Ver Estado Sistema', action: 'show_status', type: 'secondary' }
        ]
      }
    }

    if (input.includes('gracias') || input.includes('thank')) {
      return {
        content: '¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas sobre el sistema PQRS, no dudes en consultar.',
        actions: [
          { label: 'Nueva Consulta', action: 'clear_chat', type: 'secondary' }
        ]
      }
    }

    // Default response
    return {
      content: 'Entiendo tu consulta. Como asistente del Sistema PQRS de Medellín, puedo ayudarte con búsquedas de información, asignaciones de recursos, métricas del sistema, y consultas generales.',
      actions: [
        { label: 'Explorar Módulos', action: 'show_help', type: 'secondary' }
      ]
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy el Asistente IA del Sistema PQRS de Medellín. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleActionClick = (action: string) => {
    // Handle different action types
    switch (action) {
      case 'navigate_query':
        // In a real app, this would navigate to the query module
        alert('Navegando al módulo de consultas...')
        break
      case 'navigate_assignment':
        alert('Navegando al módulo de asignaciones...')
        break
      case 'navigate_metrics':
        alert('Navegando al módulo de métricas...')
        break
      case 'navigate_query_comuna1':
        setInputMessage('Buscar PQRS en Comuna 1')
        // Auto-submit after a brief delay
        setTimeout(() => handleSendMessage(), 100)
        break
      case 'navigate_assignment_comuna1':
        alert('Abriendo asignaciones para Comuna 1...')
        break
      case 'navigate_assignment_centro':
        alert('Abriendo asignaciones para zona Centro...')
        break
      case 'view_routes_centro':
        alert('Mostrando rutas optimizadas para Centro...')
        break
      case 'navigate_query_vial':
        setInputMessage('Buscar PQRS sobre infraestructura vial')
        setTimeout(() => handleSendMessage(), 100)
        break
      case 'generate_report_vial':
        alert('Generando reporte de infraestructura vial...')
        break
      case 'show_modules':
        setInputMessage('¿Qué módulos tiene el sistema?')
        setTimeout(() => handleSendMessage(), 100)
        break
      case 'show_status':
        setInputMessage('¿Cuál es el estado actual del sistema?')
        setTimeout(() => handleSendMessage(), 100)
        break
      case 'clear_chat':
        clearChat()
        break
      case 'show_help':
        setInputMessage('ayuda')
        setTimeout(() => handleSendMessage(), 100)
        break
      default:
        alert(`Acción: ${action}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Asistente IA
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Consultas inteligentes con procesamiento de lenguaje natural
          </p>
        </div>
        <Button variant="outline" onClick={clearChat} className="self-start sm:self-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Nueva Conversación
        </Button>
      </div>

      {/* Chat Container - Full screen on mobile */}
      <Card className="h-[calc(100vh-200px)] sm:h-[600px] flex flex-col" role="region" aria-label="Chat con Asistente IA">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" aria-hidden="true" />
            Chat con Asistente IA
            <Badge className="bg-green-100 text-green-800" aria-label="Asistente en línea">En línea</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={action.type === 'primary' ? 'default' : 'outline'}
                          onClick={() => handleActionClick(action.action)}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input - Accesible */}
          <div className="border-t p-4">
            <label htmlFor="chat-input" className="sr-only">
              Escribe tu mensaje para el asistente IA
            </label>
            <div className="flex gap-2">
              <input
                id="chat-input"
                type="text"
                placeholder="Escribe tu mensaje aquí..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={loading}
                aria-describedby="chat-help"
                autoComplete="off"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                aria-label={loading ? "Enviando mensaje..." : "Enviar mensaje"}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div id="chat-help" className="sr-only">
              Presiona Enter para enviar el mensaje. El asistente IA responderá automáticamente.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sugerencias de Consultas Frecuentes */}
      <Card>
        <CardHeader>
          <CardTitle>Sugerencias de Consultas Frecuentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-3"
              onClick={() => setInputMessage('¿Cuántos PQRS activos hay en Comuna 1?')}
            >
              <div>
                <div className="font-medium">📊 PQRS Activos Comuna 1</div>
                <div className="text-xs text-gray-500 mt-1">¿Cuántos PQRS activos hay en Comuna 1?</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-3"
              onClick={() => setInputMessage('Asignar personal para zona Centro')}
            >
              <div>
                <div className="font-medium">👥 Asignar Personal Centro</div>
                <div className="text-xs text-gray-500 mt-1">Asignar personal para zona Centro</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-3"
              onClick={() => setInputMessage('Buscar PQRS sobre infraestructura vial')}
            >
              <div>
                <div className="font-medium">🛣️ Infraestructura Vial</div>
                <div className="text-xs text-gray-500 mt-1">Buscar PQRS sobre infraestructura vial</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>💡 Consejos para usar el chat:</strong>
            </p>
            <p>
              • Sé específico en tus preguntas para obtener mejores respuestas
            </p>
            <p>
              • Puedes preguntar sobre PQRS, asignaciones, métricas o procedimientos
            </p>
            <p>
              • El asistente tiene conocimiento del contexto completo del sistema
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChatModule