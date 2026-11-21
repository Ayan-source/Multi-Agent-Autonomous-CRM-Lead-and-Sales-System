import express from "express";

export function buildApp() {
  const app = express();

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  return app;
}
