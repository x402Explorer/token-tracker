const apiKey = "e6d255f4-d3ce-457f-b149-883b2f3e93e2";
const grid = document.getElementById("tokenGrid");
const refreshBtn = document.getElementById("refreshBtn");
const sortSelect = document.getElementById("sortSelect");
const ageFilter = document.getElementById("ageFilter");

let allTokens = [];

async function fetchTokens() {
  grid.innerHTML = "<p>Loading tokens...</p>";
  try {
    const res = await fetch("https://data.solanatracker.io/tokens/new", {
      headers: { "x-api-key": apiKey },
    });
    const data = await res.json();
    allTokens = data.data || [];
    processTokens();
  } catch (err) {
    grid.innerHTML = "<p>⚠️ Error loading tokens</p>";
    console.error(err);
  }
}

function processTokens() {
  const now = Date.now();
  allTokens = allTokens.map(t => {
    const ageH = (now - t.createdAt) / 3600000;
    const score = calcScore(t, ageH);
    return { ...t, ageH, score };
  });
  renderTokens();
}

function calcScore(t, ageH) {
  const liq = t.liquidityUsd || 1;
  const vol = t.volume || 1;
  const mcap = t.marketCapUsd || 1;
  const dev = t.dev || 1;
  return ((liq * vol) / (mcap * dev)) / (ageH + 1);
}

function renderTokens() {
  const sortBy = sortSelect.value;
  const ageType = ageFilter.value;

  let tokens = allTokens;
  if (ageType === "new") tokens = tokens.filter(t => t.ageH <= 1);
  if (ageType === "old") tokens = tokens.filter(t => t.ageH > 1);

  tokens.sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "new") return a.ageH - b.ageH;
    if (sortBy === "liquidity") return b.liquidityUsd - a.liquidityUsd;
    if (sortBy === "volume") return b.volume - a.volume;
    if (sortBy === "marketCap") return b.marketCapUsd - a.marketCapUsd;
    return 0;
  });

  grid.innerHTML = "";
  tokens.forEach(t => {
    const card = document.createElement("div");
    card.className = "token";
    card.innerHTML = `
      <h3>${t.name || "Unknown"} (${t.symbol || "N/A"})</h3>
      <div class="metric">MCap: $${(t.marketCapUsd || 0).toFixed(0)}</div>
      <div class="metric">Volume: $${(t.volume || 0).toFixed(0)}</div>
      <div class="metric">Liquidity: $${(t.liquidityUsd || 0).toFixed(0)}</div>
      <div class="metric">Dev %: ${(t.dev || 0).toFixed(2)}%</div>
      <div class="metric">Age: ${t.ageH.toFixed(2)}h</div>
      <div class="metric">10x Score: ${t.score.toFixed(2)}</div>
      <div class="metric">CA: <a href="https://solscan.io/token/${t.mint}" target="_blank">${t.mint.slice(0,6)}...${t.mint.slice(-4)}</a></div>
    `;
    grid.appendChild(card);
  });
}

// 🧩 Bundle Radar scaffolding
// (Later we’ll analyze wallet clusters or shared activity patterns)
const bundleRadar = {
  enabled: false,
  detectedBundles: [],
  analyze(tokenData) {
    // Placeholder for clustering logic — wallet grouping
    console.log("Analyzing bundles for:", tokenData.mint);
  }
};

// Refresh logic
refreshBtn.onclick = fetchTokens;
fetchTokens();
setInterval(fetchTokens, 30000);
