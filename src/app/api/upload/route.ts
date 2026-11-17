import { requireApiUser } from "@/lib/auth";
import { isSameOrigin, jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const auth = await requireApiUser("media.write");
  if (!auth.user) return jsonError(auth.error ?? "Unauthorized", auth.status);

  return jsonError(
    "Image uploads are disabled in this demo. No file was read, stored or sent to a third party.",
    503,
  );
}
