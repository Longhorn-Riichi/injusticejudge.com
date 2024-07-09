import type { Config, Context, Netlify } from "@netlify/functions";
import { Redis } from "@upstash/redis"
import fs from "node:fs";
import process from "node:process";
import axios from "axios";
import { get_wisdom, key_to_input, to_ul } from "./util.mts";

const redis = new Redis({
  url: Netlify.env.get("REDIS_ENDPOINT"),
  token: Netlify.env.get("UPSTASH_REDIS_REST_TOKEN"),
});

const default_result = "<br/><div style='text-align: center; width: 100%'>No injustices detected.<br/>Did we miss an injustice? Contribute ideas <a href='https://github.com/Longhorn-Riichi/InjusticeJudge/issues/1'>here</a>!</div>";

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
  if (result === "" || result === "<ul></ul>") result = default_result;
  const header = "<span class='result-header'>Results:</span><hr/>";
  let body = fs.readFileSync(process.cwd() + "/_site/index.html", "utf8")
               .replace(/<div class="result"><\/div>/, `<div class="result">${header}${result}</div>`)
               .replace(/<footer>/, `<footer><small>${get_wisdom()}</small><br/>`);
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
  let key = `${identifier}@${player}`;
  let input;
  try {
    input = key_to_input(key);
  } catch (e) {
    console.error(e);
    return make_response(`<div style="text-align: center; width: 100%">Invalid input</div>`);
  }
  let result = await redis.get(key);
  if (!result) {
    let api_host = Netlify.env.get("INJUSTICEJUDGE_ENDPOINT");
    let api_url = `http://${api_host}/injustice`;
    let data = {"link": input};
    let config = {"headers": {"Content-Type": "application/json"}, "timeout": 5000};
    try {
      const response = await axios.post(api_url, data, config);
      result = fix_formatting(convert_tiles(to_ul(response.data.map(i => i.substr(2)))));
      await redis.set(key, result);
    } catch (e) {
      console.error('Error during the request:', e.message);
      result = `<div style="text-align: center; width: 100%">Error: invalid input, or backend is down</div>`
    }
  }
  return make_response(result);
}
