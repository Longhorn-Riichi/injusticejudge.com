
const majsoul_id_regex = /^[a-z0-9]{6}-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/
const majsoul_player_regex = /^a\d+(_[0-3])?|[0-3]$/
const tenhou_id_regex = /^\d{10}gm-[0-9a-f]{4}-\d{4,}-[0-9a-f]{8}$/;
const tenhou_player_regex = /^\d+$/;
const riichicity_id_regex = /^[a-z0-9]{20}$/;
// const riichicity_player_regex = /^@\d$/;

const majsoul_prefix = "https://mahjongsoul.game.yo-star.com/?paipu=";
const tenhou_prefix = "https://tenhou.net/0/?log=";

export function key_to_input(key: string) {
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
    console.error("key_to_input failed");
    throw new Error("Invalid input");
  }
  return input;
}

export function to_ul(s: string[]) {
  let ret = "";
  for (const item of s) ret += `<li>${item}</li>`;
  return `<ul>${ret}</ul>`;
}
