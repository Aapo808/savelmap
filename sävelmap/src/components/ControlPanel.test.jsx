import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ControlPanel from './ControlPanel'

describe('ControlPanel', () => {
  const mockNotes = [
    { id: 0, name: 'C', display_name: 'C' },
    { id: 1, name: 'C#', display_name: 'C#/Db' },
    { id: 2, name: 'D', display_name: 'D' },
  ]

  const mockScales = [
    { id: 'major', display_name: 'Major' },
    { id: 'minor', display_name: 'Minor' },
    { id: 'pentatonic', display_name: 'Pentatonic' },
  ]

  it('renders root and scale selectors with options', () => {
    const mockOnRootChange = vi.fn()
    const mockOnScaleChange = vi.fn()

    render(
      <ControlPanel
        notes={mockNotes}
        scales={mockScales}
        rootId={0}
        scaleId="major"
        onRootChange={mockOnRootChange}
        onScaleChange={mockOnScaleChange}
      />
    )

    // Check that labels are rendered
    expect(screen.getByText(/Root:/i)).toBeInTheDocument()
    expect(screen.getByText(/Scale:/i)).toBeInTheDocument()

    // Check that select elements exist
    const rootSelect = screen.getByDisplayValue('C')
    const scaleSelect = screen.getByDisplayValue('Major')

    expect(rootSelect).toBeInTheDocument()
    expect(scaleSelect).toBeInTheDocument()
  })

  it('calls onRootChange when root selection changes', async () => {
    const user = userEvent.setup()
    const mockOnRootChange = vi.fn()
    const mockOnScaleChange = vi.fn()

    render(
      <ControlPanel
        notes={mockNotes}
        scales={mockScales}
        rootId={0}
        scaleId="major"
        onRootChange={mockOnRootChange}
        onScaleChange={mockOnScaleChange}
      />
    )

    const rootSelect = screen.getByDisplayValue('C')
    await user.selectOptions(rootSelect, '2')

    expect(mockOnRootChange).toHaveBeenCalledWith(2)
    expect(mockOnRootChange).toHaveBeenCalledTimes(1)
  })

  it('calls onScaleChange when scale selection changes', async () => {
    const user = userEvent.setup()
    const mockOnRootChange = vi.fn()
    const mockOnScaleChange = vi.fn()

    render(
      <ControlPanel
        notes={mockNotes}
        scales={mockScales}
        rootId={0}
        scaleId="major"
        onRootChange={mockOnRootChange}
        onScaleChange={mockOnScaleChange}
      />
    )

    const scaleSelect = screen.getByDisplayValue('Major')
    await user.selectOptions(scaleSelect, 'minor')

    expect(mockOnScaleChange).toHaveBeenCalledWith('minor')
    expect(mockOnScaleChange).toHaveBeenCalledTimes(1)
  })

  it('handles empty notes and scales arrays', () => {
    const mockOnRootChange = vi.fn()
    const mockOnScaleChange = vi.fn()

    render(
      <ControlPanel
        notes={[]}
        scales={[]}
        rootId={0}
        scaleId="major"
        onRootChange={mockOnRootChange}
        onScaleChange={mockOnScaleChange}
      />
    )

    expect(screen.getByText(/Root:/i)).toBeInTheDocument()
    expect(screen.getByText(/Scale:/i)).toBeInTheDocument()
  })
})

