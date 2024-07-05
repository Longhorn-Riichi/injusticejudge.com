---
layout: default
---

# {{ site.title }}

### {{ site.subtitle }}

<form method="POST" action="/redirect" name="main-form" style="flex: 1; display: flex; flex-direction: column">
  <span class="input-popout"></span>
  <div class="input-bar">
    <input placeholder="Mahjong Soul/tenhou.net replay URL, or Riichi City replay ID" data-1p-ignore name="url" class="main-input" id="main-input" value=""/>
    <input type="checkbox" id="help"/>
    <label for="help" class="help"></label>
    <div class="help-popup">
      Examples:
      <ul>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">https://mahjongsoul.game.yo-star.com/?paipu=230822-7e07ccdb-9bb9-4957-8746-74cbf49501ca_a939260192</a></li>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">https://tenhou.net/0/?log=2023081915gm-0089-0000-0f655b26&tw=3</a></li>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">cmbem26ai08d9bg1ipog@1</a></li>
      </ul>
    </div>
    <button type="submit" id="main-button">Submit</button>
  </div>
  <!--
  <span class="input-popout">
    <input name="username" class="second-input"/>
  </span>
  -->
</form>

<div class="result"></div>

<a class="github" href="https://github.com/Longhorn-Riichi/InjusticeJudge">Github</a>




















<script type="text/javascript">
const majsoul_regex = /([a-z0-9]{6}-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})(_a\d+)?(_[0-3])?/;
const tenhou_regex = /(\d{10}gm-\d{4}-\d{4}-[0-9a-f]{8})(&tw=\d+)?/;
const riichicity_regex = /([a-z0-9]{20})(@.*)?/;
const main_input = document.getElementById("main-input");
const main_button = document.getElementById("main-button");

function toggle_popouts() {
  const popouts = [...document.querySelectorAll(".input-popout")];
  if (main_input.value.match(majsoul_regex)) {
    popouts.forEach(elem => elem.classList.add("majsoul"));
    popouts.forEach(elem => elem.classList.remove("tenhou"));
    popouts.forEach(elem => elem.classList.remove("riichicity"));
  } else if (main_input.value.match(tenhou_regex)) {
    popouts.forEach(elem => elem.classList.remove("majsoul"));
    popouts.forEach(elem => elem.classList.add("tenhou"));
    popouts.forEach(elem => elem.classList.remove("riichicity"));
  } else if (main_input.value.match(riichicity_regex)) {
    popouts.forEach(elem => elem.classList.remove("majsoul"));
    popouts.forEach(elem => elem.classList.remove("tenhou"));
    popouts.forEach(elem => elem.classList.add("riichicity"));
  } else {
    popouts.forEach(elem => elem.classList.remove("majsoul"));
    popouts.forEach(elem => elem.classList.remove("tenhou"));
    popouts.forEach(elem => elem.classList.remove("riichicity"));
  }
}

main_input.addEventListener("keyup", toggle_popouts);
toggle_popouts();

main_button.addEventListener("click", e => {main_button.innerText = "Loading...";});
</script>
