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
    console.log("Fetched tokens:", allTokens); // DEBUG: check JSON
    renderTokens();
  } catch (err) {
    grid.innerHTML = "<p>⚠️ Error loading tokens</p>";
    console.error(err);
  }
}

function renderTokens() {
  if (!allTokens.length) {
    grid.innerHTML = "<p>No tokens found.</p>";
    return;
  }

  grid.innerHTML = "";
  allTokens.forEach(t => {
    const card = document.createElement("div");
    card.className = "token";
    card.innerHTML = `
      <h3>${t.name || "Unknown"} (${t.symbol || "N/A"})</h3>
      <div class="metric">MCap: $${(t.marketCapUsd || 0).toFixed(0)}</div>
      <div class="metric">Volume: $${(t.volume || 0).toFixed(0)}</div>
      <div class="metric">Liquidity: $${(t.liquidityUsd || 0).toFixed(0)}</div>
      <div class="metric">Contract: <a href="https://solscan.io/token/${t.mint}" target="_blank">${t.mint.slice(0,6)}...${t.mint.slice(-4)}</a></div>
    `;
    grid.appendChild(card);
  });
}

// Refresh
refreshBtn.onclick = fetchTokens;
fetchTokens();
setInterval(fetchTokens, 30000);
