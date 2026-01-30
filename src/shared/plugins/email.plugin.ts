import { Elysia } from "elysia";

import { emailService, resend } from "../../email";

export const emailPlugin = new Elysia({ name: "plugin.email" })
  .decorate("resend", resend)
  .decorate("mail", emailService);
