import type { Config, Context, Netlify } from "@netlify/functions";
import fs from "node:fs";
import process from "node:process";
import { get_wisdom } from "./util.mts";

export const config: Config = {
  path: ["/", "/index.html"]
};

export default async (req: Request, context: Context) => {
  let body = fs.readFileSync(process.cwd() + "/_site/index.html", "utf8")
               .replace(/<footer>/, `<footer><small>${get_wisdom()}</small><br/>`);

  return new Response(body, {
    "status": 302,
    "headers": {"Content-Type": "text/html"}
  });
}
