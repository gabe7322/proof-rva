export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.json()

  if (body._gotcha) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log('BASE_ID:', process.env.AIRTABLE_BASE_ID)
  console.log('KEY set:', !!process.env.AIRTABLE_API_KEY)
  const airtableRes = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Applications`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name: body.name,
          Email: body.email,
          'Work Link': body.workLink,
          Discipline: body.discipline,
          'Proud Work': body.proudWork,
          'Future Work': body.futureWork,
          Collaborators: body.collaborators,
          'Project Idea': body.project,
          Excites: Array.isArray(body.excites) ? body.excites.join(', ') : body.excites,
          Commitment: body.commitment,
          'Anything Else': body.anythingElse,
        },
      }),
    }
  )

  if (!airtableRes.ok) {
    const airtableError = await airtableRes.json().catch(() => ({}))
    console.error('Airtable error:', JSON.stringify(airtableError))
    return new Response(JSON.stringify({ error: 'Failed to save application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
