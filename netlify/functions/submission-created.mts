import type { Context, Netlify } from "@netlify/functions";
import { Redis } from '@upstash/redis'
import fs from 'node:fs';
import process from 'node:process';
import util from 'node:util';
import { exec } from "node:child_process";
let pexec = util.promisify(exec);

const redis = new Redis({
  url: Netlify.env.get("REDIS_ENDPOINT"),
  token: Netlify.env.get("UPSTASH_REDIS_REST_TOKEN"),
});

const majsoul_regex = /\d{6}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}(_a[a-z0-9]+)?/
const majsoul_prefix = "https://mahjongsoul.game.yo-star.com/?paipu="

function parse_identifier(url: string, username: string) {
  let ret = ["", ""];
  let player = "";
  // console.log("checking if " + url + " matches regex");
  let match = url.match(majsoul_regex);
  // console.log(match);
  if (match) {
    ret[0] = match[0];
    if (match.length === 2) ret[1] = match[1].substr(1);
  } else {
    throw new Exception("Could not parse identifier");
  }
  // console.log(ret);
  return ret;
}

function make_response(result: string) {
  let body = fs.readFileSync("_site/index.html", "utf8").replace(/MY_CONTENT/, result);
  return new Response(body, {
    "status": 200,
    "headers": {"Content-Type": "text/html"}
  });
}

const normal_tiles = ["0m", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "0p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "0s", "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "1z", "2z", "3z", "4z", "5z", "6z", "7z", "1x"];
const normal_dora_tiles = ["0md", "1md", "2md", "3md", "4md", "5md", "6md", "7md", "8md", "9md", "0pd", "1pd", "2pd", "3pd", "4pd", "5pd", "6pd", "7pd", "8pd", "9pd", "0sd", "1sd", "2sd", "3sd", "4sd", "5sd", "6sd", "7sd", "8sd", "9sd", "1zd", "2zd", "3zd", "4zd", "5zd", "6zd", "7zd", "1xd"];
const sideways_tiles = ["0M", "1M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "0P", "1P", "2P", "3P", "4P", "5P", "6P", "7P", "8P", "9P", "0S", "1S", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "1Z", "2Z", "3Z", "4Z", "5Z", "6Z", "7Z", "1X"];
const sideways_dora_tiles = ["0Md", "1Md", "2Md", "3Md", "4Md", "5Md", "6Md", "7Md", "8Md", "9Md", "0Pd", "1Pd", "2Pd", "3Pd", "4Pd", "5Pd", "6Pd", "7Pd", "8Pd", "9Pd", "0Sd", "1Sd", "2Sd", "3Sd", "4Sd", "5Sd", "6Sd", "7Sd", "8Sd", "9Sd", "1Zd", "2Zd", "3Zd", "4Zd", "5Zd", "6Zd", "7Zd", "1Xd"];
function convert_tiles(stdout: string) {
  return stdout.replace(/<:(\d[mpszxMPSZX]d?):\d{19}>/g, (m, tile) => {
    let [y, x, width] = [normal_tiles.indexOf(tile), 0, 0.75];
    if (y == -1) [y, x, width] = [normal_dora_tiles.indexOf(tile), 0.75, 0.75];
    if (y == -1) [y, x, width] = [sideways_tiles.indexOf(tile), 1.5, 1];
    if (y == -1) [y, x, width] = [sideways_dora_tiles.indexOf(tile), 2.5, 1];
    return `<div class="tile${width===1 ? ' sideways' : ''}" style="background-position: -${x}em -${y}em;"></div>`;
  });
}

export default async (req: Request, context: Context) => {
  // unwrap the request
  const { payload } = await req.json();
  const url = payload.data.url;
  const given_username = payload.data.username;
  let identifier, player;
  try {
    [identifier, player] = parse_identifier(url, given_username);
  } catch (e) {
    return make_response("Invalid input");
  }

  let key = `${identifier}@${player}`;
  let result = await redis.get(key);
  if (!result) {
    const url2 = "https://mahjongsoul.game.yo-star.com/?paipu=" + identifier + "_" + player;
    process.env["use_discord_tile_emoji"] = "True";
    const opts = {"cwd": process.cwd() + "/InjusticeJudge"};
    const { stdout, stderr } = await pexec("python main.py " + url2, opts);
    console.log("stdout:\n" + stdout + "\nstderr:\n" + stderr);
    result = convert_tiles(stdout);
    await redis.set(key, result);
  }

  return make_response(result);
}
