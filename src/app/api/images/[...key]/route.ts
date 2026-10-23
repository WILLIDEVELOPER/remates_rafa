import { serveImage } from "@/server/presentation/http/serve-image";

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/images/[...key]">,
) {
  const { key } = await params;
  return serveImage(request, key);
}
