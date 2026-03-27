(async () => {
  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  function inferAgeCategory(ageText) {
    if (!ageText) return "";
    const lower = ageText.toLowerCase();
    let years = 0, months = 0;
    const matchYears = lower.match(/(\d+)\s+year/);
    if (matchYears) years = parseInt(matchYears[1], 10);
    const matchMonths = lower.match(/(\d+)\s+month/);
    if (matchMonths) months = parseInt(matchMonths[1], 10);
    const totalMonths = years * 12 + months;
    if (totalMonths < 6) return "Puppy";
    if (totalMonths < 36) return "Young Adult";
    if (totalMonths < 120) return "Adult";
    return "Senior";
  }

  function extractCompat(text, phrase) {
    const lower = text.toLowerCase();
    const key = "live with " + phrase.toLowerCase();
    const idx = lower.indexOf(key);
    if (idx === -1) return "";
    const windowText = lower.slice(Math.max(0, idx - 60), idx + key.length + 60);
    if (windowText.includes("cannot")) return "no";
    if (windowText.includes("may be able")) return "maybe";
    if (windowText.includes("can")) return "yes";
    return "";
  }

  function extractBio(text) {
    const normalized = text.replace(/[\u2019]/g, "'");
    const marker = "There's no other dog at the shelter quite like me!";
    const idx = normalized.indexOf(marker);
    if (idx === -1) return "";
    const after = normalized.slice(idx + marker.length);
    const endMarkers = ["ADOPT ME", "THE ADOPTION PROCESS"];
    let endIndex = after.length;
    endMarkers.forEach(m => {
      const i = after.indexOf(m);
      if (i !== -1 && i < endIndex) endIndex = i;
    });
    return after.slice(0, endIndex).split("\n").map(l => l.trim()).filter(Boolean).join(" ");
  }

  async function clickAllLoadMore(maxClicks = 50) {
    for (let i = 0; i < maxClicks; i++) {
      const btn = Array.from(document.querySelectorAll("button, a")).find(el => el.textContent.trim() === "Load More");
      if (!btn) break;
      btn.click();
      await sleep(2500);
    }
  }

  async function scrapeIndexCards() {
    const learnLinks = Array.from(document.querySelectorAll("a")).filter(a => a.textContent.trim() === "Learn More");
    const results = [];
    for (const link of learnLinks) {
      const href = link.href;
      const card = link.closest(".views-row") || link.closest("article") || link.closest("li") || link.parentElement;
      if (!card) continue;
      const anchors = Array.from(card.querySelectorAll("a")).filter(a => a.href === href);
      let name = "";
      for (const a of anchors) {
        const t = a.textContent.trim();
        if (t && t !== "Learn More") { name = t; break; }
      }
      const lines = card.innerText.split("\n").map(l => l.trim()).filter(Boolean);
      const nameIndex = lines.indexOf(name);
      const genderSizeLine = nameIndex !== -1 ? (lines[nameIndex + 1] || "") : "";
      const ageLine = nameIndex !== -1 ? (lines[nameIndex + 2] || "") : "";
      const internalId = nameIndex !== -1 ? (lines[nameIndex + 3] || "") : "";
      let gender = "", size = "";
      if (genderSizeLine.includes(",")) {
        const parts = genderSizeLine.split(",");
        gender = (parts[0] || "").trim();
        size = (parts[1] || "").trim();
      }
      const img = card.querySelector("img");
      const photoUrl = img ? img.src : "";
      const ageCategory = inferAgeCategory(ageLine);
      const slugMatch = href.match(/\/adopt\/([^\/?#]+)/);
      const slug = slugMatch ? slugMatch[1] : "";
      results.push({ slug, internalId, name, gender, size, ageText: ageLine, ageCategory, adoptionPage: href, photoUrl });
    }
    return results;
  }

  async function enrichFromProfilePages(dogs, delayMs = 1000) {
    for (const dog of dogs) {
      try {
        const res = await fetch(dog.adoptionPage);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const text = doc.body.innerText || "";
        dog.bio = extractBio(text);
        dog.compatDogs = extractCompat(text, "other dogs");
        dog.compatCats = extractCompat(text, "cats");
        dog.compatKids = extractCompat(text, "young children");
        dog.hasDisability = /I have a disability/i.test(text);
        const careMatch = text.match(/Care\s+([^\n]+)/i);
        dog.careLabel = careMatch ? careMatch[1].trim() : (dog.hasDisability ? "Has disability" : "");
        await sleep(delayMs);
      } catch (err) {
        console.warn("Error fetching profile for", dog.name, err);
      }
    }
  }

  function toCsv(dogs) {
    const headers = ["slug","internalId","name","gender","size","ageText","ageCategory","adoptionPage","photoUrl","hasDisability","careLabel","compatDogs","compatCats","compatKids","bio"];
    function cell(v) { const s = v == null ? "" : String(v).replace(/"/g, '""'); return `"${s}"`; }
    return [headers.map(cell).join(","), ...dogs.map(d => headers.map(h => cell(d[h])).join(","))].join("\n");
  }

  await clickAllLoadMore();
  const dogs = await scrapeIndexCards();
  await enrichFromProfilePages(dogs, 1000);
  const csv = toCsv(dogs);
  window.soiDogData = dogs;
  try { if (typeof copy === "function") copy(csv); else console.log(csv); } catch (err) { console.log(csv); }
})();
