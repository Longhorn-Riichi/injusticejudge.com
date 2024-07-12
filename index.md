---
layout: default
---

<form method="POST" action="/redirect" name="main-form" style="flex: 1; display: flex; flex-direction: column">
  <span class="input-popout"></span>
  <div class="input-bar">
    <input placeholder="Mahjong Soul/tenhou.net replay URL, or Riichi City replay ID" data-1p-ignore name="url" class="main-input" id="main-input" value=""/>
    <input type="checkbox" id="help"/>
    <label for="help" class="help"></label>
    <div class="help-popup">
      Examples:
      <ul>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">https://mahjongsoul.game.yo-star.com/?paipu=220930-8a7c1e7f-2114-46f9-80d4-208067ef0385_a939260192</a></li>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">https://mahjongsoul.game.yo-star.com/?paipu=230822-7e07ccdb-9bb9-4957-8746-74cbf49501ca_a939260192</a></li>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">https://tenhou.net/0/?log=2023121909gm-000b-18940-d853a264&tw=3</a></li>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">https://tenhou.net/3/?log=2023081915gm-0089-0000-0f655b26&tw=3</a></li>
        <li><a href="#" onclick="main_input.value = this.innerText; toggle_popouts(); return false;">cmon7d6ai08d9bi5k8l0@0</a></li>
      </ul>
    </div>
    <button type="submit" id="main-button">Submit</button>
  </div>
</form>

<div class="result"></div>

<footer>
  <a href="/skill">Skills</a>
  |
  <a href="/statistics">Statistics</a>
  |
  <a href="https://github.com/Longhorn-Riichi/injusticejudge.com">Github</a>
</footer>
