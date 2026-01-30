import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ElysiaAdapter } from "@bull-board/elysia";

import { allQueues } from "./queues";

export const serverAdapter = new ElysiaAdapter("/admin/queues");

createBullBoard({
  options: {
    // This configuration fixes a build error on Bun caused by eval
    // https://github.com/oven-sh/bun/issues/5809#issuecomment-2065310008
    uiBasePath: "node_modules/@bull-board/ui",
  },
  queues: allQueues.map((queue) => new BullMQAdapter(queue)),
  serverAdapter,
});
