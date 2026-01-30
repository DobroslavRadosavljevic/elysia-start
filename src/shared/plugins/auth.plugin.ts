import { Elysia } from "elysia";

export const authPlugin = new Elysia({ name: "plugin.auth" }).derive(
  { as: "scoped" },
  ({ headers }) => ({
    bearer: headers.authorization?.replace("Bearer ", "") ?? null,
  })
);
