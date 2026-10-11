import { buildApp } from "./app.ts";

const app = buildApp();
const port = Number(process.env.PORT ?? 3000);

app.on("error", (error) => {
  console.error("Unable to start SalesGenie API:", error);
  process.exitCode = 1;
});

app.listen(port, "127.0.0.1", () => {
  console.log(`SalesGenie API listening at http://127.0.0.1:${port}`);
});
