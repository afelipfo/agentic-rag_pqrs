import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { Button } from './Button'

interface SearchSuggestion {
  text: string
  type: 'recent' | 'popular' | 'suggestion'
  count?: number
}

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  onClear?: () => void
  onSuggestionSelect?: (suggestion: string) => void
  suggestions?: SearchSuggestion[]
  recentSearches?: string[]
  popularSearches?: string[]
  className?: string
  showSuggestions?: boolean
}

const SearchBar = ({
  placeholder = "Buscar PQRS...",
  onSearch,
  onClear,
  onSuggestionSelect,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  className = "",
  showSuggestions = true
}: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock suggestions based on query
  const getSuggestions = (searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim()) {
      // Show recent and popular when no query
      const recent = recentSearches.slice(0, 3).map(text => ({ text, type: 'recent' as const }))
      const popular = popularSearches.slice(0, 2).map(text => ({ text, type: 'popular' as const, count: Math.floor(Math.random() * 50) + 10 }))
      return [...recent, ...popular]
    }

    // Generate suggestions based on query
    const baseSuggestions = [
      `${searchQuery} alumbrado`,
      `${searchQuery} vías`,
      `${searchQuery} agua`,
      `${searchQuery} transporte`,
      `problemas ${searchQuery}`,
      `solicitud ${searchQuery}`
    ]

    return baseSuggestions.slice(0, 5).map(text => ({ text, type: 'suggestion' as const }))
  }

  const currentSuggestions = getSuggestions(query)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(showSuggestions && (value.length > 0 || currentSuggestions.length > 0))
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || currentSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < currentSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(currentSuggestions[selectedIndex].text)
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSuggestionSelect?.(suggestion)
    onSearch(suggestion)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
    onClear?.()
    inputRef.current?.focus()
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />
      case 'popular':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      default:
        return <Search className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => showSuggestions && setIsOpen(currentSuggestions.length > 0)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            aria-label="Buscar PQRS"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
            aria-autocomplete="list"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && currentSuggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {currentSuggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${index}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion.text)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              {getSuggestionIcon(suggestion.type)}
              <div className="flex-1 min-w-0">
                <span className="text-gray-900 truncate block">{suggestion.text}</span>
                {suggestion.type === 'popular' && suggestion.count && (
                  <span className="text-xs text-gray-500">
                    {suggestion.count} búsquedas
                  </span>
                )}
                {suggestion.type === 'recent' && (
                  <span className="text-xs text-gray-500">Búsqueda reciente</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar