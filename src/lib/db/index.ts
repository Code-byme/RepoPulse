import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import { getDatabaseUrl } from "@/lib/env/server";
import * as schema from "@/lib/db/schema";

type Db = NeonHttpDatabase<typeof schema>;

let client: Db | undefined;

function createDb(): Db {
  return drizzle(neon(getDatabaseUrl()), { schema });
}

export function getDb(): Db {
  if (!client) {
    client = createDb();
  }

  return client;
}

export const db = new Proxy({} as Db, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

export type Database = Db;
