import "server-only";

import { Inngest } from "inngest";

import { getInngestEventKey } from "@/lib/env/server";

export const inngest = new Inngest({
  id: "repopulse",
  eventKey: getInngestEventKey(),
});
