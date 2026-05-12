import { Elysia } from "elysia";
import { timingSafeEqual } from "node:crypto";

import { env } from "../../config";
import { serverAdapter } from "../../queues/board";

export const bullBoardPlugin = new Elysia({ name: "plugin.bull-board" })
  // Authentication guard for /admin/queues/*
  .onBeforeHandle({ as: "scoped" }, ({ request, path, set }) => {
    // Only protect Bull Board routes
    if (!path.startsWith("/admin/queues")) {
      return;
    }

    const authHeader = request.headers.get("authorization");

    // No auth header - prompt for credentials
    if (!authHeader?.startsWith("Basic ")) {
      set.status = 401;
      set.headers["WWW-Authenticate"] = 'Basic realm="Bull Board"';
      return "Unauthorized";
    }

    // Decode and validate credentials
    try {
      const credentials = atob(authHeader.slice(6));
      const [username, password] = credentials.split(":");

      // Use timing-safe comparison to prevent timing attacks
      const usernameValid =
        username.length === env.BULL_BOARD_USERNAME.length &&
        timingSafeEqual(
          Buffer.from(username),
          Buffer.from(env.BULL_BOARD_USERNAME)
        );
      const passwordValid =
        password.length === env.BULL_BOARD_PASSWORD.length &&
        timingSafeEqual(
          Buffer.from(password),
          Buffer.from(env.BULL_BOARD_PASSWORD)
        );

      if (!usernameValid || !passwordValid) {
        set.status = 401;
        set.headers["WWW-Authenticate"] = 'Basic realm="Bull Board"';
        return "Invalid credentials";
      }
    } catch {
      set.status = 401;
      set.headers["WWW-Authenticate"] = 'Basic realm="Bull Board"';
      return "Invalid credentials";
    }
  })
  // Mount Bull Board
  .use(serverAdapter.registerPlugin());
