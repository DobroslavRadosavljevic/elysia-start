import { Elysia } from "elysia";

import { s3, s3Service } from "../../s3";

export const s3Plugin = new Elysia({ name: "plugin.s3" })
  .decorate("s3Client", s3)
  .decorate("s3", s3Service);
