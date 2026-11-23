import express, { type ErrorRequestHandler, type RequestHandler } from "express";

const requestNotFound: RequestHandler = (_request, response) => {
  response.status(404).json({
    error: { code: "NOT_FOUND", message: "Route not found." },
  });
};

const requestError: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  const type =
    typeof error === "object" && error !== null && "type" in error
      ? (error as { type?: unknown }).type
      : undefined;

  if (type === "entity.parse.failed") {
    response.status(400).json({
      error: { code: "INVALID_JSON", message: "Request body must be valid JSON." },
    });
    return;
  }

  if (type === "entity.too.large") {
    response.status(413).json({
      error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds the 100 KB limit." },
    });
    return;
  }

  response.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
  });
};

export { requestError as apiErrorHandler, requestNotFound as apiNotFoundHandler };

export function buildApp() {
  const app = express();

  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use(requestNotFound);
  app.use(requestError);

  return app;
}
