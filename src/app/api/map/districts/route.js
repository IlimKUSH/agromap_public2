export async function GET(req) {
  const { searchParams } = new URL(req.url)

  const regionName = searchParams.get('regionName')
  const response = await fetch(
    process.env.BACKEND_MAP_API_URL +
      `/agromapv2/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=agromapv2:agro_district_raw&outputFormat=application/json&SORTBY=dname_r&CQL_FILTER=pname_r='${regionName}'`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  const data = await response.json()
  return new Response(JSON.stringify(data), { status: response.status })
}
