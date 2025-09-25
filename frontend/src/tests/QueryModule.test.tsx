import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QueryModule from '../components/modules/QueryModule'

// Mock de servicios
vi.mock('../services/api', () => ({
  apiService: {
    searchPQRS: vi.fn(),
  },
}))

vi.mock('../hooks/useDebounce', () => ({
  useDebounce: (value: any) => value, // Retorna el valor inmediatamente para tests
}))

describe('QueryModule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search interface correctly', () => {
    render(<QueryModule />)

    expect(screen.getByText('Consultas Inteligentes PQRS')).toBeInTheDocument()
    expect(screen.getByText('Búsqueda de PQRS')).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByLabelText(/Buscar por/)).toBeInTheDocument()
  })

  it('shows search type buttons', () => {
    render(<QueryModule />)

    expect(screen.getByRole('button', { name: /Por Radicado/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Búsqueda Inteligente/ })).toBeInTheDocument()
  })

  it('toggles search type correctly', () => {
    render(<QueryModule />)

    const semanticButton = screen.getByRole('button', { name: /Búsqueda Inteligente/ })
    const radicadoButton = screen.getByRole('button', { name: /Por Radicado/ })

    // Initially semantic search should be selected
    expect(semanticButton).toHaveAttribute('aria-pressed', 'true')
    expect(radicadoButton).toHaveAttribute('aria-pressed', 'false')

    // Click radicado button
    fireEvent.click(radicadoButton)

    expect(radicadoButton).toHaveAttribute('aria-pressed', 'true')
    expect(semanticButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows advanced filters when toggled', () => {
    render(<QueryModule />)

    const filtersButton = screen.getByRole('button', { name: /Filtros Avanzados/ })
    expect(filtersButton).toBeInTheDocument()

    fireEvent.click(filtersButton)

    expect(screen.getByLabelText('Estado')).toBeInTheDocument()
    expect(screen.getByLabelText('Comuna')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo de Solicitud')).toBeInTheDocument()
  })

  it('displays loading state during search', async () => {
    const mockApiService = vi.mocked(require('../services/api').apiService)
    mockApiService.searchPQRS.mockResolvedValue({
      results: [],
      total_found: 0,
      query_type: 'semantic'
    })

    render(<QueryModule />)

    const searchInput = screen.getByLabelText(/Buscar por/)
    fireEvent.change(searchInput, { target: { value: 'test query' } })

    // Wait for debounce and search to complete
    await waitFor(() => {
      expect(mockApiService.searchPQRS).toHaveBeenCalled()
    })
  })

  it('displays search results correctly', async () => {
    const mockApiService = vi.mocked(require('../services/api').apiService)
    const mockResults = [{
      numero_radicado_entrada: '202410000123',
      estado: 'activo',
      asunto: 'Problema con alumbrado público',
      tipo_solicitud: 'Petición',
      fecha_radicacion: '2024-01-15',
      comuna_hecho: 'Comuna 1',
      barrio_hecho: 'Popular',
      nombre_peticionario: 'Juan Pérez'
    }]

    mockApiService.searchPQRS.mockResolvedValue({
      results: mockResults,
      total_found: 1,
      query_type: 'semantic'
    })

    render(<QueryModule />)

    const searchInput = screen.getByLabelText(/Buscar por/)
    fireEvent.change(searchInput, { target: { value: 'alumbrado' } })

    await waitFor(() => {
      expect(screen.getByText('Resultados de Búsqueda (1)')).toBeInTheDocument()
      expect(screen.getByText('Radicado: 202410000123')).toBeInTheDocument()
      expect(screen.getByText('Problema con alumbrado público')).toBeInTheDocument()
    })
  })

  it('shows no results message when search returns empty', async () => {
    const mockApiService = vi.mocked(require('../services/api').apiService)
    mockApiService.searchPQRS.mockResolvedValue({
      results: [],
      total_found: 0,
      query_type: 'semantic'
    })

    render(<QueryModule />)

    const searchInput = screen.getByLabelText(/Buscar por/)
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

    await waitFor(() => {
      expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument()
    })
  })

  it('expands and collapses result details', async () => {
    const mockApiService = vi.mocked(require('../services/api').apiService)
    const mockResults = [{
      numero_radicado_entrada: '202410000123',
      estado: 'activo',
      asunto: 'Test PQRS',
      tipo_solicitud: 'Petición',
      fecha_radicacion: '2024-01-15'
    }]

    mockApiService.searchPQRS.mockResolvedValue({
      results: mockResults,
      total_found: 1,
      query_type: 'semantic'
    })

    render(<QueryModule />)

    const searchInput = screen.getByLabelText(/Buscar por/)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ver Detalles/ })).toBeInTheDocument()
    })

    const detailsButton = screen.getByRole('button', { name: /Ver Detalles/ })
    fireEvent.click(detailsButton)

    expect(screen.getByText('Información Detallada')).toBeInTheDocument()

    fireEvent.click(detailsButton)
    expect(screen.queryByText('Información Detallada')).not.toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    const mockApiService = vi.mocked(require('../services/api').apiService)
    mockApiService.searchPQRS.mockRejectedValue(new Error('API Error'))

    render(<QueryModule />)

    const searchInput = screen.getByLabelText(/Buscar por/)
    fireEvent.change(searchInput, { target: { value: 'error test' } })

    await waitFor(() => {
      expect(screen.getByText('API_NO_DISPONIBLE')).toBeInTheDocument()
      expect(screen.getByText(/Error de conexión/)).toBeInTheDocument()
    })
  })

  it('maintains accessibility attributes', () => {
    render(<QueryModule />)

    // Check ARIA labels
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()

    // Check button accessibility
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeEnabled()
    })
  })
})