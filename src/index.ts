import { app } from "./app";

app.listen(3000);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `OpenAPI docs available at http://${app.server?.hostname}:${app.server?.port}/openapi`
);
