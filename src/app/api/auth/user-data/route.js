export async function GET(req) {
  const serverCookie = req.headers.get('server-cookie')

  if (!serverCookie) {
    return new Response(null, { status: 400 })
  }

  const response = await fetch(`${process.env.BACKEND_API_URL}/ws/user/data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: serverCookie,
    },
  })

  if (!response.ok) {
    return new Response(null, { status: response.status })
  }

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
