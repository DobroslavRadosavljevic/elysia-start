import { app } from "./app";
import { env } from "./config";

app.listen(env.PORT);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `OpenAPI docs available at http://${app.server?.hostname}:${app.server?.port}/openapi`
);
