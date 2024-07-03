import type { Context, Netlify } from "@netlify/functions";
import { Redis } from '@upstash/redis'
import fs from 'node:fs';
import process from 'node:process';

const redis = new Redis({
  url: Netlify.env.get("REDIS_ENDPOINT"),
  token: Netlify.env.get("UPSTASH_REDIS_REST_TOKEN"),
});

const majsoul_regex = /\d{6}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}(_a[a-z0-9]+)?/

function parse_identifier(url, username) {
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

function make_response(result) {
  let body = fs.readFileSync("_site/index.html", "utf8").replace(/MY_CONTENT/, result);
  return new Response(body, {
    "status": 200,
    "headers": {"Content-Type": "text/html"}
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
    result = "Hello World!"
    await redis.set(key, result);
  }

  return make_response(result);
}
