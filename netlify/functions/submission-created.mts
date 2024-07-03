import type { Context, Netlify } from "@netlify/functions";
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: Netlify.env.get("REDIS_ENDPOINT"),
  token: Netlify.env.get("REDIS_TOKEN"),
});

export default async (req: Request, context: Context) => {
  // const { url } = JSON.parse(event.body);
  // pretend we broke url into identifier and player
  identifier = "220609-dd14987e-a246-4267-836a-ea4503713994"
  player = "a823629735"
  key = `${identifier}@${player}`

  let result = await redis.get(key);
  if (!result) {
    result = "Hello World!"
    await redis.set(key, result);
  }
  return new Response("", {
    "status": 302,
    "headers": {
      "Location": `/?req=${encodeURIComponent(req.body)}identifier=${encodeURIComponent(identifier)}&player=${encodeURIComponent(player)}`
    }
  });
}
