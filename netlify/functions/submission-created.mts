import type { Context, Netlify } from "@netlify/functions";
import { Redis } from '@upstash/redis'
import fs from 'node:fs';
import process from 'node:process';

const redis = new Redis({
  url: Netlify.env.get("REDIS_ENDPOINT"),
  token: Netlify.env.get("UPSTASH_REDIS_REST_TOKEN"),
});

export default async (req: Request, context: Context) => {
  // const { url } = JSON.parse(event.body);
  // pretend we broke url into identifier and player
  console.log("started!");
  console.log("cwd is " + process.cwd());
  console.log("url is " + Netlify.env.get("REDIS_ENDPOINT"));
  let identifier = "220609-dd14987e-a246-4267-836a-ea4503713994";
  let player = "a823629735";
  let key = `${identifier}@${player}`;

  console.log("waiting for redis");
  let result = await redis.get(key);
  console.log("done waiting for redis, got result " + result);
  if (!result) {
    result = "Hello World!"
    console.log("pushing to redis");
    await redis.set(key, result);
    console.log("done pushing to redis");
  }

  console.log("loading body");
  let body = fs.readFileSync("_site/index.html", "utf8").replace(/MY_CONTENT/, result);
  console.log("done loading body: " + body);

  console.log("returning");
  return new Response(body, {
    "status": 200,
    "headers": {"Content-Type": "text/html"}
  });
}
