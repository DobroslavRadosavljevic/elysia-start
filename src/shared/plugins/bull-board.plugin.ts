import { Elysia } from "elysia";

import { env } from "../../config";
import { serverAdapter } from "../../queues/board";
import { UnauthorizedError } from "../errors";

export const bullBoardPlugin = new Elysia({ name: "plugin.bull-board" })
  // Authentication guard for /admin/queues/*
  .onBeforeHandle({ as: "scoped" }, ({ request, path }) => {
    // Only protect Bull Board routes
    if (!path.startsWith("/admin/queues")) {
      return;
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Basic ")) {
      throw new UnauthorizedError("Basic auth required");
    }

    const credentials = atob(authHeader.slice(6));
    const [username, password] = credentials.split(":");

    if (
      username !== env.BULL_BOARD_USERNAME ||
      password !== env.BULL_BOARD_PASSWORD
    ) {
      throw new UnauthorizedError("Invalid credentials");
    }
  })
  // Mount Bull Board
  .use(serverAdapter.registerPlugin());
