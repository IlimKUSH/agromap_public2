export async function POST(req) {
  const body = await req.json()

  if (!body.username || !body.password) {
    return new Response(null, { status: 400 })
  }

  const response = await fetch(`${process.env.BACKEND_API_URL}/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    return new Response(null, { status: response.status })
  }

  return new Response(JSON.stringify({ username: body.username }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      cookie: response.headers.get('set-cookie'),
    },
  })
}
