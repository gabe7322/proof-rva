import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import useAirtable from '../../src/hooks/useAirtable'

const samplePayload = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  workLink: 'https://instagram.com/jordanlee',
  discipline: 'DJ',
  proudWork: 'My debut EP',
  futureWork: 'A live audiovisual show',
  collaborators: 'Filmmakers and visual artists',
  project: 'A collaborative short film',
  excites: ['Meeting collaborators'],
  commitment: 'yes',
  anythingElse: '',
  _gotcha: '',
}

describe('useAirtable', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with idle status', () => {
    const { result } = renderHook(() => useAirtable())
    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  it('sets status to loading while submitting', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(
      () => new Promise(() => {}) // never resolves
    )
    const { result } = renderHook(() => useAirtable())
    act(() => { result.current.submit(samplePayload) })
    expect(result.current.status).toBe('loading')
  })

  it('sets status to success on 200 response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    const { result } = renderHook(() => useAirtable())
    await act(async () => { await result.current.submit(samplePayload) })
    expect(result.current.status).toBe('success')
    expect(result.current.error).toBeNull()
  })

  it('sets status to error on non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed' }),
    })
    const { result } = renderHook(() => useAirtable())
    await act(async () => { await result.current.submit(samplePayload) })
    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Submission failed')
  })

  it('posts to /api/submit-application with JSON body', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    const { result } = renderHook(() => useAirtable())
    await act(async () => { await result.current.submit(samplePayload) })
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/submit-application',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      })
    )
  })
})
