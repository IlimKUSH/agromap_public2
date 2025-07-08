export async function GET() {
  const response = await fetch(
    process.env.BACKEND_MAP_API_URL +
      '/agromapv2/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=agromapv2:agro_region_raw&outputFormat=application/json&SORTBY=adm1_ru',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  const data = await response.json()
  return new Response(JSON.stringify(data), { status: 200 })
}
