/**
 * Miro Layout Test
 * Tests exact positioning, sizing, and layout behaviour of Miro board items.
 *
 * Usage:
 *   MIRO_TOKEN=<token> MIRO_BOARD=<boardId> node miro-layout-test.mjs
 *
 * Or hardcode below for convenience.
 */

const TOKEN = process.env.MIRO_TOKEN || "eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_biuRuYuf8zQrKE1fasaX6uW1FIQ";
const BOARD = process.env.MIRO_BOARD || "uXjVHZEoQRA=";
const BASE = "https://api.miro.com/v2";

const createdIds = [];

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  return res.status === 204 ? null : JSON.parse(text);
}

function pos(data) {
  return `x=${data.position?.x} y=${data.position?.y} relativeTo=${data.position?.relativeTo}`;
}

function geo(data) {
  return `w=${data.geometry?.width} h=${data.geometry?.height}`;
}

async function cleanup() {
  console.log(`\n🧹 Cleaning up ${createdIds.length} items...`);
  for (const { type, id } of createdIds) {
    try {
      await req("DELETE", `/boards/${BOARD}/${type}/${id}`);
    } catch (e) {
      // ignore
    }
  }
}

async function run() {
  console.log("=== Miro Layout Test ===\n");

  // ---- 1. Create test frame ----
  console.log("1. Creating test frame (3200×1800, 16:9)...");
  const frame = await req("POST", `/boards/${BOARD}/frames`, {
    data: { title: "LAYOUT TEST — DELETE ME", format: "custom", type: "freeform" },
    position: { x: 9000, y: 0, origin: "center" },
    geometry: { width: 3200, height: 1800 },
  });
  createdIds.push({ type: "frames", id: frame.id });
  console.log(`   Frame id=${frame.id} ${pos(frame)} ${geo(frame)}`);

  // ---- 2. Test sticky at various y values inside frame ----
  const yTests = [0, 100, 200, 300, 350, 400, 500];
  console.log("\n2. Testing sticky y positions inside frame (x=110, width=200)...");
  for (const y of yTests) {
    const s = await req("POST", `/boards/${BOARD}/sticky_notes`, {
      data: { content: `y=${y}`, shape: "square" },
      position: { x: 110, y, origin: "center" },
      geometry: { width: 200 },
      style: { fillColor: "light_yellow" },
      parent: { id: frame.id },
    });
    createdIds.push({ type: "sticky_notes", id: s.id });
    const topEdge = s.position.y - s.geometry.height / 2;
    const bottomEdge = s.position.y + s.geometry.height / 2;
    console.log(`   y=${String(y).padStart(3)}: returned ${pos(s)} ${geo(s)} → top_edge=${topEdge.toFixed(1)} bottom_edge=${bottomEdge.toFixed(1)}`);
  }

  // ---- 3. Test grid layout — 4 columns ----
  console.log("\n3. Testing 4-column grid layout...");
  const gridItems = [
    { col: 0, row: 0, x: 200,  y: 350 },
    { col: 1, row: 0, x: 550,  y: 350 },
    { col: 2, row: 0, x: 900,  y: 350 },
    { col: 3, row: 0, x: 1250, y: 350 },
    { col: 0, row: 1, x: 200,  y: 750 },
    { col: 1, row: 1, x: 550,  y: 750 },
    { col: 2, row: 1, x: 900,  y: 750 },
    { col: 3, row: 1, x: 1250, y: 750 },
  ];
  for (const g of gridItems) {
    const s = await req("POST", `/boards/${BOARD}/sticky_notes`, {
      data: { content: `c${g.col}r${g.row}`, shape: "square" },
      position: { x: g.x, y: g.y, origin: "center" },
      geometry: { width: 300 },
      style: { fillColor: "cyan" },
      parent: { id: frame.id },
    });
    createdIds.push({ type: "sticky_notes", id: s.id });
    const rightEdge = s.position.x + s.geometry.width / 2;
    const bottomEdge = s.position.y + s.geometry.height / 2;
    console.log(`   col${g.col} row${g.row}: ${pos(s)} ${geo(s)} → right_edge=${rightEdge.toFixed(1)} bottom_edge=${bottomEdge.toFixed(1)}`);
  }

  // ---- 4. Check overlap between adjacent stickies ----
  console.log("\n4. Overlap check (col0→col1, pitch=350, sticky_w=300)...");
  console.log(`   Right edge of col0 = 200 + 150 = 350`);
  console.log(`   Left  edge of col1 = 550 - 150 = 400`);
  console.log(`   Gap = ${550 - 150 - (200 + 150)}px`);

  // ---- 5. Frame boundary check ----
  console.log("\n5. Frame boundary checks (frame 3200×1800)...");
  console.log(`   Right edge of col3 = 1250 + 150 = 1400  (frame right = 3200, margin = 1800px — room for more cols)`);
  console.log(`   Bottom edge row1   = 750 + ${(344/2).toFixed(1)} = ${(750 + 344/2).toFixed(1)}  (frame bottom = 1800, margin = ${(1800 - 750 - 344/2).toFixed(1)}px)`);

  // ---- 6. Test frame title bar — sticky at y=0 ----
  console.log("\n6. Where does y=0 land? (top edge = 0 - h/2 = negative = behind title bar)");
  const s0 = await req("POST", `/boards/${BOARD}/sticky_notes`, {
    data: { content: "y=0 test", shape: "square" },
    position: { x: 500, y: 0, origin: "center" },
    geometry: { width: 200 },
    style: { fillColor: "red" },
    parent: { id: frame.id },
  });
  createdIds.push({ type: "sticky_notes", id: s0.id });
  console.log(`   y=0: ${pos(s0)} ${geo(s0)} → top_edge=${(s0.position.y - s0.geometry.height/2).toFixed(1)}`);

  console.log("\n✅ Test complete. Review board at https://miro.com/app/board/" + BOARD);
  console.log("\nPress Ctrl+C to keep items on board, or wait 10s to auto-cleanup...\n");

  await new Promise(r => setTimeout(r, 10000));
  await cleanup();
}

run().catch(async (err) => {
  console.error("ERROR:", err.message);
  await cleanup();
  process.exit(1);
});
