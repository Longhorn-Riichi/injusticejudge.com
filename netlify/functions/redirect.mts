import type { Context } from "@netlify/functions";

const majsoul_regex = /(\d{6}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})(_a\d+)?/;
const tenhou_regex = /(\d{10}gm-\d{4}-\d{4}-[0-9a-f]{8})(&tw=\d+)?/;
const riichicity_regex = /([a-z0-9]{20})(@.*)?/;

function parse_identifier(url: string, username?: string) {
  let ret = ["", undefined];
  // TODO make this cleaner
  let match = url.match(majsoul_regex);
  if (match) {
    ret[0] = match[1];
    if (match.length >= 3 && match[2] !== undefined) ret[1] = match[2].substr(1);
    return ret;
  }
  match = url.match(tenhou_regex);
  if (match) {
    ret[0] = match[1];
    if (match.length >= 3 && match[2] !== undefined) ret[1] = match[2].substr(4);
    return ret;
  }
  match = url.match(riichicity_regex);
  if (match) {
    ret[0] = match[1];
    console.log(match);
    if (match.length >= 3 && match[2] !== undefined) ret[1] = match[2].substr(1);
    else ret[1] = username;
    return ret;
  }
  throw new Error("Could not parse identifier");
}

export default async (req: Request, context: Context) => {
  // unwrap the request
  const params = (await req.text()).split("&");
  const url = decodeURIComponent(params[0].split("=")[1]);
  const username = decodeURIComponent(params[1].split("=")[1]);
  let identifier, player, location;
  // console.log(url, username);
  try {
    [identifier, player] = parse_identifier(url, username);
    if (player === "") player = "_";
    location = `/${encodeURIComponent(identifier)}/${encodeURIComponent(player)}`;
  } catch (e) {
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
