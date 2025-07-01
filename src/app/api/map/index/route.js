export async function GET(req) {

  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type");
  const name = searchParams.get("name");

  const response = await fetch(process.env.NEXT_PUBLIC_API_DOMEN + `/agroadmin/ws/public/vi?type=${type}&name=${name}`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {status: response.status});
}
