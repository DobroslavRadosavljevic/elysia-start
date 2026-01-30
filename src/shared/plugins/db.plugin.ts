import { Elysia } from "elysia";

import { db } from "../../db";

export const dbPlugin = new Elysia({ name: "plugin.db" }).decorate("db", db);
