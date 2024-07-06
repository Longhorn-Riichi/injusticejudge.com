import type { Config, Context, Netlify } from "@netlify/functions";
import { Redis } from "@upstash/redis"
import fs from "node:fs";
import process from "node:process";
import { key_to_input, to_ul } from "./util.mts";

const redis = new Redis({
  url: Netlify.env.get("REDIS_ENDPOINT"),
  token: Netlify.env.get("UPSTASH_REDIS_REST_TOKEN"),
});

const majsoul_id_regex = /^[a-z0-9]{6}-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/
const majsoul_player_regex = /^a\d+(_[0-3])?|[0-3]$/
const tenhou_id_regex = /^\d{10}gm-[0-9a-f]{4}-\d{4,}-[0-9a-f]{8}$/;
const tenhou_player_regex = /^\d+$/;
const riichicity_id_regex = /^[a-z0-9]{20}$/;
const riichicity_player_regex = /^@\d$/;
const majsoul_prefix = "https://mahjongsoul.game.yo-star.com/?paipu=";
const tenhou_prefix = "https://tenhou.net/0/?log=";

function key_to_input(key: string) {
  let [identifier, player] = key.split("@", 2);
  let input = "";
  if (player === "_") player = "";
  if (identifier.match(majsoul_id_regex) && (player === "" || player.match(majsoul_player_regex))) {
    input = majsoul_prefix + identifier;
    if (player !== "") input += `_${player}`;
  } else if (identifier.match(tenhou_id_regex) && (player === "" || player.match(tenhou_player_regex))) {
    input = tenhou_prefix + identifier;
    if (player !== "") input += `&tw=${player}`;
  } else if (identifier.match(riichicity_id_regex)) {
    input = identifier;
    if (player !== "") input += `@${player}`;
  } else {
    throw new Error("Invalid input")
  }
  return input;
}
async function random_inputs(amt) {
  amt = Math.min(amt, await redis.dbsize());
  const inputs = new Set();
  while (inputs.size < amt) {
    const key = await redis.randomkey();
    if (key) inputs.add(key_to_input(key)); else break;
  }
  return Array.from(inputs);
}

function to_ul(s: string[]) {
  let ret = "";
  for (const item of s) ret += `<li>${item}</li>`;
  return `<ul>${ret}</ul>`;
}

export const config: Config = {
  path: ["/", "/index.html"]
};

export default async (req: Request, context: Context) => {
  let inputs = await random_inputs(5);
  let result = to_ul(inputs.map(i => `<a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">${i}</a>`));
  const header = "<span class='result-header'>Recent queries:</span><hr/>";
  let body = fs.readFileSync(process.cwd() + "/_site/index.html", "utf8")
               .replace(/<div class="result"><\/div>/, `<div class="result">${header}${result}</div>`);
  return new Response(body, {
    "status": 302,
    "headers": {"Content-Type": "text/html"}
  });
}
