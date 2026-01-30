import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

describe("Elysia App", () => {
  it("should return hello message on root route", async () => {
    const app = new Elysia().get("/", () => "Hello Elysia");

    const response = await app.handle(new Request("http://localhost/"));
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toBe("Hello Elysia");
  });

  it("should return 404 for unknown routes", async () => {
    const app = new Elysia().get("/", () => "Hello Elysia");

    const response = await app.handle(
      new Request("http://localhost/not-found")
    );

    expect(response.status).toBe(404);
  });
});
