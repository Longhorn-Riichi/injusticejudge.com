import type { Config, Context } from "@netlify/functions";
import fs from "node:fs";
import process from "node:process";
import { get_sophistry } from "./util.mts";

export const config: Config = {
  path: ["/skill", "/skill.html"]
};

export default async (req: Request, context: Context) => {
  let body = fs.readFileSync(process.cwd() + "/_site/skill.html", "utf8")
               .replace(/<footer>/, `<footer><small>${get_sophistry()}</small><br/>`)
               .replace(/injustices suffered/g, "displays of true skill")
               .replace("<a href=\"/skill\">Skills</a>", "<a href=\"/\">Injustices</a>");
  return new Response(body, {
    "status": 302,
    "headers": {"Content-Type": "text/html"}
  });
}
