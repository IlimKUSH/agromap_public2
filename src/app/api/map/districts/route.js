export async function GET(req) {
  // Get the search params from the URL
  const { searchParams } = new URL(req.url)

  // For example, to get ?regionId=xxx
  const regionName = searchParams.get('regionName')
  console.log(regionName)
  // Now you can use regionId in your CQL_FILTER or elsewhere
  const response = await fetch(
    process.env.BACKEND_MAP_API_URL +
      `/agromapv2/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=agromapv2:agro_districts_raw&outputFormat=application/json&CQL_FILTER=adm1_ru='${regionName}'`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  const data = await response.json()
  return new Response(JSON.stringify(data), { status: response.status })
}
