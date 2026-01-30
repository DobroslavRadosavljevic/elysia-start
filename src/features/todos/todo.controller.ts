import { Elysia } from "elysia";

import { ErrorResponse, IdParam } from "../../shared/models";
import {
  TodoCreateSchema,
  TodoListResponseSchema,
  TodoResponseSchema,
  TodoUpdateSchema,
} from "./todo.model";
import { TodoService } from "./todo.service";

export const todoController = new Elysia({ prefix: "/todos" })
  .post("/", ({ body }) => TodoService.create(body), {
    body: TodoCreateSchema,
    detail: {
      description: "Create a new todo item",
      summary: "Create todo",
      tags: ["Todos"],
    },
    response: {
      200: TodoResponseSchema,
      400: ErrorResponse,
    },
  })
  .get("/", () => TodoService.getAll(), {
    detail: {
      description: "Retrieve all todo items",
      summary: "List todos",
      tags: ["Todos"],
    },
    response: TodoListResponseSchema,
  })
  .get(
    "/:id",
    async ({ params, status }) => {
      const todo = await TodoService.getById(params.id);
      return todo ?? status(404, { message: "Todo not found" });
    },
    {
      detail: {
        description: "Retrieve a specific todo item by ID",
        summary: "Get todo",
        tags: ["Todos"],
      },
      params: IdParam,
      response: {
        200: TodoResponseSchema,
        404: ErrorResponse,
      },
    }
  )
  .patch(
    "/:id",
    async ({ body, params, status }) => {
      const todo = await TodoService.update(params.id, body);
      return todo ?? status(404, { message: "Todo not found" });
    },
    {
      body: TodoUpdateSchema,
      detail: {
        description: "Update an existing todo item",
        summary: "Update todo",
        tags: ["Todos"],
      },
      params: IdParam,
      response: {
        200: TodoResponseSchema,
        404: ErrorResponse,
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, status }) => {
      const todo = await TodoService.delete(params.id);
      return todo ?? status(404, { message: "Todo not found" });
    },
    {
      detail: {
        description: "Delete a todo item",
        summary: "Delete todo",
        tags: ["Todos"],
      },
      params: IdParam,
      response: {
        200: TodoResponseSchema,
        404: ErrorResponse,
      },
    }
  );
