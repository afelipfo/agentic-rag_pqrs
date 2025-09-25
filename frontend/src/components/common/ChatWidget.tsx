import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent } from './Card'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy el Asistente IA del Sistema PQRS. ¿En qué puedo ayudarte? Puedo buscar PQRS, hacer asignaciones o responder preguntas sobre el sistema.',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Simple response logic - in real implementation this would call the backend
    if (message.includes('buscar') || message.includes('pqrs') || message.includes('radicado')) {
      return 'Para buscar PQRS, puedes usar el módulo de consultas. Ingresa el número de radicado o utiliza la búsqueda semántica para encontrar PQRS por contenido.'
    }

    if (message.includes('asignar') || message.includes('personal') || message.includes('vehículo')) {
      return 'Para asignaciones, utiliza el módulo de asignaciones inteligentes. Selecciona una zona en el mapa y el sistema te sugerirá la asignación óptima.'
    }

    if (message.includes('métrica') || message.includes('estadística') || message.includes('reporte')) {
      return 'Las métricas están disponibles en el módulo de monitoreo. Incluye KPIs en tiempo real, gráficos interactivos y estadísticas de rendimiento.'
    }

    if (message.includes('ayuda') || message.includes('cómo')) {
      return 'Estoy aquí para ayudarte. Puedes preguntarme sobre:\n• Cómo buscar PQRS específicos\n• Cómo hacer asignaciones de personal\n• Información sobre métricas y reportes\n• Procedimientos del sistema'
    }

    return 'Entiendo tu consulta. Para obtener información más específica, te recomiendo explorar los módulos correspondientes del sistema. ¿Hay algo en particular sobre lo que necesitas ayuda?'
  }

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage.trim()),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          aria-label="Abrir chat de asistencia IA"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-white shadow-2xl border-2 border-blue-200 transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Asistente IA</h3>
              <p className="text-xs text-gray-500">Sistema PQRS Medellín</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
              aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.role === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Sugerencias de Consultas Frecuentes */}
              <div className="mt-2 space-y-1">
                <div className="text-xs text-gray-500 mb-2">Sugerencias frecuentes:</div>
                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={() => setInputMessage('¿Cuántos PQRS activos hay en Comuna 1?')}
                    className="text-xs bg-blue-50 hover:bg-blue-100 px-2 py-2 rounded text-left text-blue-700 border border-blue-200"
                    disabled={loading}
                  >
                    📊 ¿Cuántos PQRS activos hay en Comuna 1?
                  </button>
                  <button
                    onClick={() => setInputMessage('Asignar personal para zona Centro')}
                    className="text-xs bg-green-50 hover:bg-green-100 px-2 py-2 rounded text-left text-green-700 border border-green-200"
                    disabled={loading}
                  >
                    👥 Asignar personal para zona Centro
                  </button>
                  <button
                    onClick={() => setInputMessage('Buscar PQRS sobre infraestructura vial')}
                    className="text-xs bg-purple-50 hover:bg-purple-100 px-2 py-2 rounded text-left text-purple-700 border border-purple-200"
                    disabled={loading}
                  >
                    🛣️ Buscar PQRS sobre infraestructura vial
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default ChatWidget