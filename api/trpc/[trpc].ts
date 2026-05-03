import type { IncomingMessage, ServerResponse } from "node:http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    console.error(`[tRPC] ${path ?? "unknown"}:`, error);
  },
});

export default function vercelHandler(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}
