import { Elysia } from "elysia";

import {
  ErrorResponseSchema,
  IdParamSchema,
  PaginatedResponseSchema,
  PaginationSchema,
} from "../../shared/models";
import { authPlugin } from "../../shared/plugins/auth.plugin";
import {
  TodoCreateSchema,
  TodoResponseSchema,
  TodoUpdateSchema,
} from "./todo.model";
import { TodoService } from "./todo.service";

export const todoController = new Elysia({ prefix: "/todos" })
  .use(authPlugin)
  .post(
    "/",
    async ({ body, status, user }) => {
      const todo = await TodoService.create(body, user.id);
      return status(201, todo);
    },
    {
      auth: true,
      body: TodoCreateSchema,
      detail: {
        description: "Create a new todo item",
        summary: "Create todo",
        tags: ["Todos"],
      },
      response: {
        201: TodoResponseSchema,
        400: ErrorResponseSchema,
      },
    }
  )
  .get("/", ({ query, user }) => TodoService.getAll(user.id, query), {
    auth: true,
    detail: {
      description: "Retrieve all todo items with pagination",
      summary: "List todos",
      tags: ["Todos"],
    },
    query: PaginationSchema,
    response: PaginatedResponseSchema(TodoResponseSchema),
  })
  .get(
    "/:id",
    async ({ params, status, user }) => {
      const todo = await TodoService.getById(params.id, user.id);
      return todo ?? status(404, { message: "Todo not found" });
    },
    {
      auth: true,
      detail: {
        description: "Retrieve a specific todo item by ID",
        summary: "Get todo",
        tags: ["Todos"],
      },
      params: IdParamSchema,
      response: {
        200: TodoResponseSchema,
        404: ErrorResponseSchema,
      },
    }
  )
  .patch(
    "/:id",
    async ({ body, params, status, user }) => {
      const todo = await TodoService.update(params.id, body, user.id);
      return todo ?? status(404, { message: "Todo not found" });
    },
    {
      auth: true,
      body: TodoUpdateSchema,
      detail: {
        description: "Update an existing todo item",
        summary: "Update todo",
        tags: ["Todos"],
      },
      params: IdParamSchema,
      response: {
        200: TodoResponseSchema,
        404: ErrorResponseSchema,
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, status, user }) => {
      const todo = await TodoService.delete(params.id, user.id);
      return todo ?? status(404, { message: "Todo not found" });
    },
    {
      auth: true,
      detail: {
        description: "Delete a todo item",
        summary: "Delete todo",
        tags: ["Todos"],
      },
      params: IdParamSchema,
      response: {
        200: TodoResponseSchema,
        404: ErrorResponseSchema,
      },
    }
  );
