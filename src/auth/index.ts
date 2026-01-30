import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { env } from "../config";
import { db } from "../db";
import { redis } from "../redis";

export const auth = betterAuth({
  basePath: "/auth",
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
  secondaryStorage: {
    delete: async (key) => {
      await redis.del(key);
    },
    get: async (key) => {
      const value = await redis.get(key);
      return value ?? null;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, "EX", ttl);
      } else {
        await redis.set(key, value);
      }
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: [env.BETTER_AUTH_URL],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

// OpenAPI schema utilities for merging with Elysia's OpenAPI
let _schema: Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>;

const getSchema = async () => {
  _schema ??= await auth.api.generateOpenAPISchema();
  return _schema;
};

type OpenAPIComponents = Record<string, unknown>;
type OpenAPIPaths = Record<string, unknown>;

export const authOpenAPI = {
  getComponents: async (): Promise<OpenAPIComponents> => {
    const { components } = await getSchema();
    return components as OpenAPIComponents;
  },
  getPaths: async (prefix = "/auth"): Promise<OpenAPIPaths> => {
    const { paths } = await getSchema();
    const reference: OpenAPIPaths = Object.create(null);

    for (const path of Object.keys(paths)) {
      const key = prefix + path;
      reference[key] = paths[path];

      for (const method of Object.keys(paths[path])) {
        const operation = (reference[key] as Record<string, unknown>)[method];
        (operation as Record<string, unknown>).tags = ["Auth"];
      }
    }

    return reference;
  },
};
