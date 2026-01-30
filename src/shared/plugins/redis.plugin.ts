import { Elysia } from "elysia";

import { kv, redis } from "../../redis";

export const redisPlugin = new Elysia({ name: "plugin.redis" })
  .decorate("redis", redis)
  .decorate("kv", kv);
