import { useState } from 'react'

export default function useAirtable() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const submit = async (data) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return { submit, status, error }
}
