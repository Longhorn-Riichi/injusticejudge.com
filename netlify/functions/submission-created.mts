import type { Context, Netlify } from "@netlify/functions";

const majsoul_regex = /(\d{6}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})(_a[a-z0-9]+)?/

function parse_identifier(url: string, username: string) {
  let ret = ["", ""];
  let player = "";
  // console.log("checking if " + url + " matches regex");
  let match = url.match(majsoul_regex);
  // console.log(match);
  if (match) {
    ret[0] = match[1];
    if (match.length === 3) ret[1] = match[2].substr(1);
  } else {
    throw new Error("Could not parse identifier");
  }
  // console.log(ret);
  return ret;
}

export default async (req: Request, context: Context) => {
  // unwrap the request
  const { payload } = await req.json();
  const url = payload.data.url;
  const username = payload.data.username;
  let identifier, player, location;
  try {
    [identifier, player] = parse_identifier(url, username);
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
