export async function GET() {
  const response = await fetch(process.env.BACKEND_API_URL + "/login/esi-link", {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });

  if (!response.ok) {
    return new Response(null, {status: response.status});
  }

  const data = await response.text();

  return new Response(JSON.stringify(data), {status: 200});
}
