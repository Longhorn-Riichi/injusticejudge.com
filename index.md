---
layout: default
---

# {{ site.title }}

### {{ site.subtitle }}

<form method="POST" action="/.netlify/functions/redirect" name="main-form" style="flex: 1; display: flex; flex-direction: column">
  <span class="input-popout"></span>
  <div style="flex: 1; display: flex; flex-direction: row; padding: 0 1rem;">
    <input placeholder="Mahjong Soul/tenhou.net replay URL, or Riichi City replay ID" name="url" class="main-input" id="main-input" value=""/>
    <button type="submit" id="main-button">Submit</button>
  </div>
  <!--
  <span class="input-popout">
    <input name="username" class="second-input"/>
  </span>
  -->
</form>

<div class="result"></div>


<script type="text/javascript">
const majsoul_regex = /([a-z0-9]{6}-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})(_a\d+)?(_[0-3)?/;
const tenhou_regex = /(\d{10}gm-\d{4}-\d{4}-[0-9a-f]{8})(&tw=\d+)?/;
const riichicity_regex = /([a-z0-9]{20})(@.*)?/;

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

main_input = document.getElementById("main-input");
main_input.addEventListener("keyup", toggle_popouts);
toggle_popouts();

main_button = document.getElementById("main-button");
main_button.addEventListener("click", e => {main_button.innerText = "Loading...";});
</script>
