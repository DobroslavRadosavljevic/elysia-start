import { Elysia } from "elysia";

import { kvService, redis } from "../../redis";

export const redisPlugin = new Elysia({ name: "plugin.redis" })
  .decorate("redis", redis)
  .decorate("kv", kvService);
