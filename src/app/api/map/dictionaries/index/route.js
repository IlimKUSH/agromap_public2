export async function GET() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_DOMEN +
      '/agroadmin/ws/public/selection/vegetation.indexes.selection',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  const data = await response.json()
  return new Response(JSON.stringify(data), { status: response.status })
}
