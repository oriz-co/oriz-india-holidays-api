import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "oriz-api-bot/0.1 (+https://oriz.in/about)";

const FALLBACK = (year) => [
  { date: `${year}-01-26`, name: "Republic Day", localName: "Republic Day", type: "national", states: null },
  { date: `${year}-08-15`, name: "Independence Day", localName: "Independence Day", type: "national", states: null },
  { date: `${year}-10-02`, name: "Gandhi Jayanti", localName: "Gandhi Jayanti", type: "national", states: null },
  { date: `${year}-12-25`, name: "Christmas Day", localName: "Christmas Day", type: "national", states: null }
];

async function fetchYear(year) {
  try {
    const r = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000)
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return data.map(h => ({
      date: h.date,
      name: h.name,
      localName: h.localName,
      type: (h.types && h.types[0]) || "national",
      states: h.counties || null
    }));
  } catch (e) {
    console.warn(`[holidays] year ${year} upstream failed:`, e.message);
    return FALLBACK(year);
  }
}

async function main() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];
  const dataDir = join(ROOT, "data");
  await mkdir(dataDir, { recursive: true });
  let latest;
  for (const y of years) {
    const holidays = await fetchYear(y);
    const out = {
      source: "https://date.nager.at/api/v3/PublicHolidays",
      year: y,
      fetchedAt: new Date().toISOString(),
      count: holidays.length,
      holidays
    };
    await writeFile(join(dataDir, `holidays-${y}.json`), JSON.stringify(out, null, 2));
    if (y === currentYear) latest = out;
    console.log(`[holidays] wrote ${holidays.length} for ${y}`);
  }
  await writeFile(join(dataDir, "latest.json"), JSON.stringify(latest, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
