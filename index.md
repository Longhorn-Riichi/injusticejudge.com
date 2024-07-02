---
layout: default
---

# {{ site.title }}

### {{ site.subtitle }}

<form method="POST" data-netlify="true" style="flex: 1; display: flex; flex-direction: column">
  <input type="hidden" name="form" class="main-input"/>
  <span class="input-popout">Riichi City ID</span>
  <div style="flex: 1; display: flex; flex-direction: row; padding: 0 1rem;">
    <input type="url" name="url" class="main-input"/>
    <button type="submit">Submit</button>
  </div>
  <span class="input-popout">Riichi City Username:
      <input name="username" class="second-input"/>
    </span>
</form>
<div style="flex: 1; display: flex; flex-direction: row; padding: 1rem;">
  <div style="flex: 5; border: 2px solid black">
    content
  </div>
  <div style="flex: 3; border: 2px solid red">
  </div>
</div>
