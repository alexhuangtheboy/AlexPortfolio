import type { IncomingMessage, ServerResponse } from "node:http";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: IncomingMessage;
  res: ServerResponse;
  user: User | null;
};

export async function createContext(opts: {
  req: IncomingMessage;
  res: ServerResponse;
}): Promise<TrpcContext> {
  return {
    req: opts.req,
    res: opts.res,
    user: null,
  };
}
