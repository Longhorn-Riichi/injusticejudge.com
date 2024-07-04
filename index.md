---
layout: default
---

# {{ site.title }}

### {{ site.subtitle }}

<form method="POST" netlify action="/" name="main-form" style="flex: 1; display: flex; flex-direction: column">
  <span class="input-popout">Riichi City ID</span>
  <div style="flex: 1; display: flex; flex-direction: row; padding: 0 1rem;">
    <input placeholder="Mahjong Soul/tenhou.net replay URL, or Riichi City replay ID" name="url" class="main-input"/>
    <button type="submit">Submit</button>
  </div>
  <span class="input-popout">Riichi City Username:
      <input name="username" class="second-input"/>
    </span>
</form>

<div class="result"></div>
