import { vi, describe, it, expect, beforeEach } from 'vitest'

let handler

const makeRequest = (body, method = 'POST') => ({
  method,
  json: async () => body,
})

const airtableSuccess = {
  ok: true,
  json: async () => ({ id: 'rec123' }),
}

const airtableFailure = {
  ok: false,
  json: async () => ({ error: { message: 'INVALID_VALUE_FOR_COLUMN' } }),
}

const validBody = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  workLink: 'https://instagram.com/jordanlee',
  discipline: 'DJ',
  proudWork: 'My debut EP',
  futureWork: 'A live audiovisual show',
  collaborators: 'Filmmakers',
  project: 'A short film',
  excites: ['Meeting collaborators'],
  commitment: 'yes',
  anythingElse: '',
  _gotcha: '',
}

describe('submit-application serverless function', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    process.env.AIRTABLE_API_KEY = 'fakekey'
    process.env.AIRTABLE_BASE_ID = 'fakebase'
    vi.resetModules()
    handler = (await import('../../netlify/functions/submit-application.js')).default
  })

  it('returns 405 for non-POST requests', async () => {
    const res = await handler(makeRequest(validBody, 'GET'))
    expect(res.status).toBe(405)
  })

  it('silently succeeds for honeypot-filled submissions', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    const res = await handler(makeRequest({ ...validBody, _gotcha: 'bot@spam.com' }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('posts correct fields to Airtable and returns success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(airtableSuccess)
    const res = await handler(makeRequest(validBody))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
  })

  it('returns 500 when Airtable responds with an error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(airtableFailure)
    const res = await handler(makeRequest(validBody))
    expect(res.status).toBe(500)
  })

  it('sends the correct Airtable API URL', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(airtableSuccess)
    await handler(makeRequest(validBody))
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.airtable.com/v0/fakebase/Applications',
      expect.anything()
    )
  })
})
