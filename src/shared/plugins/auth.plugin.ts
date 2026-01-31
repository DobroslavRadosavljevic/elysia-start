import { Elysia } from "elysia";

import { auth, type Session, type User } from "../../auth";

export const authPlugin = new Elysia({ name: "plugin.auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ request: { headers }, status }) {
        const session = await auth.api.getSession({ headers });

        if (!session) {
          return status(401, { message: "Unauthorized" });
        }

        return {
          session: session.session,
          user: session.user,
        };
      },
    },
  });

export interface AuthContext {
  session: Session;
  user: User;
}
