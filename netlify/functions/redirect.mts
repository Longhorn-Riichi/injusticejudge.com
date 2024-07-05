import type { Context } from "@netlify/functions";

const majsoul_regex = /([a-z0-9]{6}-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})(_a\d+)?(_[0-3]?)/;
const tenhou_regex = /(\d{10}gm-\d{4}-\d{4}-[0-9a-f]{8})(&tw=\d+)?/;
const riichicity_regex = /([a-z0-9]{20})(@.*)?/;

function parse_identifier(url: string) {
  for (let r of [majsoul_regex, tenhou_regex, riichicity_regex]) {
    let match = url.match(r);
    if (match) return [match[1], (match.length >= 3 && match.at(-1) !== undefined ? match.at(-1).substr(1) : "")];
  }
  throw new Error("Could not parse identifier");
}

export default async (req: Request, context: Context) => {
  // unwrap the request
  const params = (await req.text()).split("&");
  const url = decodeURIComponent(params[0].split("=")[1]);
  let identifier, player, location;
  // console.log(url);
  try {
    [identifier, player] = parse_identifier(url);
    if (player === "") player = "_";
    else if (player.startsWith("tw=")) player = player.substr(3);
    location = `/${encodeURIComponent(identifier)}/${encodeURIComponent(player)}`;
  } catch (e) {
    console.error(e)
    location = "/invalid/input";
  }
  // send data to function
  return new Response("", {
    "status": 302,
    "headers": {
      "Location": location,
      "Cache-Control": "no-cache",
    },
  });
}
