import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Application from '../../src/components/Application'

// Mock useAirtable
vi.mock('../../src/hooks/useAirtable', () => ({
  default: vi.fn(),
}))

import useAirtable from '../../src/hooks/useAirtable'

const mockIdle = { submit: vi.fn(), status: 'idle', error: null }
const mockSuccess = { submit: vi.fn(), status: 'success', error: null }

describe('Application form', () => {
  beforeEach(() => {
    useAirtable.mockReturnValue(mockIdle)
  })

  it('renders Step 1 by default', () => {
    render(<Application />)
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('does not advance past Step 1 with empty required fields', async () => {
    render(<Application />)
    await userEvent.click(screen.getByText(/continue/i))
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument()
  })

  it('advances to Step 2 after filling Step 1 required fields', async () => {
    render(<Application />)
    await userEvent.type(screen.getByLabelText(/name/i), 'Jordan Lee')
    await userEvent.type(screen.getByLabelText(/email/i), 'jordan@example.com')
    await userEvent.type(screen.getByLabelText(/instagram/i), 'https://instagram.com/j')
    await userEvent.selectOptions(screen.getByLabelText(/discipline/i), 'DJ')
    await userEvent.click(screen.getByText(/continue/i))
    await waitFor(() => expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument())
  })

  it('shows confirmation message after successful submission', async () => {
    useAirtable.mockReturnValue(mockSuccess)
    render(<Application />)
    expect(screen.getByText(/we read every application personally/i)).toBeInTheDocument()
  })

  it('honeypot field is hidden and empty by default', () => {
    render(<Application />)
    const honeypot = document.querySelector('input[name="_gotcha"]')
    expect(honeypot).toBeInTheDocument()
    expect(honeypot.value).toBe('')
    expect(honeypot).toHaveStyle({ display: 'none' })
  })
})
