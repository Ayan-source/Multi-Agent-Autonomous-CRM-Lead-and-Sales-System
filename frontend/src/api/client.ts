export interface HealthResponse {
  status: "ok";
}

export async function checkApiHealth(): Promise<HealthResponse> {
  const response = await fetch("/health", {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API returned HTTP ${response.status}.`);
  }

  const body: unknown = await response.json();
  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body) ||
    body.status !== "ok"
  ) {
    throw new Error("API returned an unexpected health response.");
  }

  return { status: "ok" };
}
