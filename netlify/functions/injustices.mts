import type { Config, Context, Netlify } from "@netlify/functions";
import { Redis } from '@upstash/redis'
import fs from 'node:fs';
import process from 'node:process';
import axios from 'axios';
import util from 'node:util';

const redis = new Redis({
  url: Netlify.env.get("REDIS_ENDPOINT"),
  token: Netlify.env.get("UPSTASH_REDIS_REST_TOKEN"),
});

const majsoul_id_regex = /^\d{6}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
const majsoul_player_regex = /^a\d+$/
const tenhou_id_regex = /^\d{10}gm-\d{4}-\d{4}-[0-9a-f]{8}$/;
const tenhou_player_regex = /^\d+$/;
const riichicity_id_regex = /^[a-z0-9]{20}$/;
const riichicity_player_regex = /^@\d$/;

const majsoul_prefix = "https://mahjongsoul.game.yo-star.com/?paipu=";
const tenhou_prefix = "https://tenhou.net/0/?log=";

function to_ul(s: string[]) {
  let ret = "";
  for (const line of s) ret += `<li>${line.substr(2)}</li>`;
  return `<ul>${ret}</ul>`;
  // TODO return something if there are no results
}

const normal_tiles = ["0m", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "0p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "0s", "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "1z", "2z", "3z", "4z", "5z", "6z", "7z", "1x"];
const normal_dora_tiles = ["0md", "1md", "2md", "3md", "4md", "5md", "6md", "7md", "8md", "9md", "0pd", "1pd", "2pd", "3pd", "4pd", "5pd", "6pd", "7pd", "8pd", "9pd", "0sd", "1sd", "2sd", "3sd", "4sd", "5sd", "6sd", "7sd", "8sd", "9sd", "1zd", "2zd", "3zd", "4zd", "5zd", "6zd", "7zd", "1xd"];
const sideways_tiles = ["0M", "1M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "0P", "1P", "2P", "3P", "4P", "5P", "6P", "7P", "8P", "9P", "0S", "1S", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "1Z", "2Z", "3Z", "4Z", "5Z", "6Z", "7Z", "1X"];
const sideways_dora_tiles = ["0Md", "1Md", "2Md", "3Md", "4Md", "5Md", "6Md", "7Md", "8Md", "9Md", "0Pd", "1Pd", "2Pd", "3Pd", "4Pd", "5Pd", "6Pd", "7Pd", "8Pd", "9Pd", "0Sd", "1Sd", "2Sd", "3Sd", "4Sd", "5Sd", "6Sd", "7Sd", "8Sd", "9Sd", "1Zd", "2Zd", "3Zd", "4Zd", "5Zd", "6Zd", "7Zd", "1Xd"];
function convert_tiles(s: string) {
  return s.replace(/<:(\d[mpszxMPSZX]d?):\d{19}>/g, (m, tile) => {
    let [y, x, width] = [normal_tiles.indexOf(tile), 0, 0.75];
    if (y == -1) [y, x, width] = [normal_dora_tiles.indexOf(tile), 0.75, 0.75];
    if (y == -1) [y, x, width] = [sideways_tiles.indexOf(tile), 1.5, 1];
    if (y == -1) [y, x, width] = [sideways_dora_tiles.indexOf(tile), 2.5, 1];
    return `<div class="tile${width===1 ? ' sideways' : ''}" style="background-position: -${x}em -${y}em;"></div>`;
  });
}

function fix_formatting(s: string) {
  return s.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/\*(.*?)\*/g, "<i>$1</i>")
          .replace(/\u2007/g, "<span> </span>");
}

function make_response(result: string, prefill?: string) {
  let body = fs.readFileSync(process.cwd() + "/_site/index.html", "utf8")
               .replace(/<div class="result"><\/div>/, `<div class="result">${result}</div>`);
  if (prefill) body = body.replace(/value=""/, `value="${prefill}"`);
  return new Response(body, {
    "status": 302,
    "headers": {"Content-Type": "text/html"}
  });
}

export const config: Config = {
  path: "/:identifier/:player"
};

export default async (req: Request, context: Context) => {
  // unwrap the request, if any
  const identifier = decodeURIComponent(context.params.identifier);
  let player = decodeURIComponent(context.params.player);
  let input = "";
  if (player === "_") player = "";
  if (identifier.match(majsoul_id_regex) && (player === "" || player.match(majsoul_player_regex))) {
    input = majsoul_prefix + identifier;
    if (player !== "") input += `_${player}`;
  } else if (identifier.match(tenhou_id_regex) && (player === "" || player.match(tenhou_player_regex))) {
    input = tenhou_prefix + identifier;
    if (player !== "") input += `&tw=${player}`;
  } else if (identifier.match(riichicity_id_regex) && player !== "") {
    input = identifier;
    if (player !== "") input += `@${player}`;
  } else {
    if (identifier.match(riichicity_id_regex) && player === "") {
      return make_response(`<div style="text-align: center; width: 100%">Input <b>id@username</b> for Riichi City</div>`, identifier + "@");
    } else {
      return make_response(`<div style="text-align: center; width: 100%">Invalid input</div>`);
    }
  }

  let key = `${identifier}@${player}`;
  let result = await redis.get(key);
  if (!result) {
    let api_url = "http://129.153.119.220:5111/injustice";
    let data = {"link": input};
    let config = {"headers": {"Content-Type": "application/json"}};
    try {
      const response = await axios.post(api_url, data, config);
      result = fix_formatting(convert_tiles(to_ul(response.data)));
      await redis.set(key, result);
    } catch (e) {
      console.error('Error during the request:', e.message);
      result = `<div style="text-align: center; width: 100%">Error: invalid input, or backend is down</div>`
    }
  }
  return make_response(result);
}
