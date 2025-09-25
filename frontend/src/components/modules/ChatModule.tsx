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
      // Simulate AI response (in real implementation, this would call the backend)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateAIResponse(inputMessage.trim()),
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
        setLoading(false)
      }, 1000 + Math.random() * 2000) // Simulate 1-3 second response time
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, verifica que el backend esté ejecutándose.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Simple pattern matching for demo purposes
    if (input.includes('pqrs') && input.includes('buscar')) {
      return 'Para buscar PQRS específicas, puedes usar el módulo de Consultas. Te recomiendo buscar por número de radicado o usar la búsqueda inteligente con palabras clave como "alumbrado público" o "vías en mal estado".'
    }

    if (input.includes('asignar') || input.includes('personal')) {
      return 'Para asignar personal y vehículos a PQRS activas, utiliza el módulo de Asignaciones. El sistema utiliza IA para optimizar las asignaciones basándose en zona geográfica, disponibilidad de recursos y urgencia de las solicitudes.'
    }

    if (input.includes('estadística') || input.includes('métrica')) {
      return 'El módulo de Métricas te muestra KPIs importantes como el total de PQRS, tasa de resolución, tiempo promedio de respuesta, y distribución por zonas. Puedes actualizar los datos en tiempo real.'
    }

    if (input.includes('ayuda') || input.includes('help')) {
      return 'Estoy aquí para ayudarte con:\n\n• Consultas sobre PQRS específicas\n• Información sobre asignaciones de recursos\n• Estadísticas y métricas del sistema\n• Procedimientos administrativos\n• Preguntas sobre el funcionamiento del sistema\n\n¿Hay algo específico en lo que te gustaría que te ayude?'
    }

    if (input.includes('hola') || input.includes('buenos días') || input.includes('buenas tardes')) {
      return '¡Hola! Es un gusto atenderte. ¿En qué puedo ayudarte con el Sistema PQRS de Medellín hoy?'
    }

    if (input.includes('gracias') || input.includes('thank')) {
      return '¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas sobre el sistema PQRS, no dudes en consultar.'
    }

    // Default response
    return 'Entiendo tu consulta. Como asistente del Sistema PQRS de Medellín, puedo ayudarte con búsquedas de información, asignaciones de recursos, métricas del sistema, y consultas generales. ¿Podrías ser más específico sobre lo que necesitas?'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Asistente IA
          </h1>
          <p className="text-gray-600">
            Consultas inteligentes con procesamiento de lenguaje natural
          </p>
        </div>
        <Button variant="outline" onClick={clearChat}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Nueva Conversación
        </Button>
      </div>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat con Asistente IA
            <Badge className="bg-green-100 text-green-800">En línea</Badge>
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

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu mensaje aquí..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => setInputMessage('¿Cómo puedo buscar una PQRS específica?')}
            >
              🔍 Buscar PQRS
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => setInputMessage('¿Cómo funciona el sistema de asignaciones?')}
            >
              👥 Asignaciones
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => setInputMessage('¿Qué métricas están disponibles?')}
            >
              📊 Ver métricas
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