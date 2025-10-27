const feed = document.getElementById('feed');
const sortNewestBtn = document.getElementById('sortNewest');
const sortVolumeBtn = document.getElementById('sortVolume');

const trackerApiKey = 'c89d3b53-74e2-42ac-8c0c-8b4f393d60bb';
let allTokens = [];
let currentSort = 'newest';

// Fetch tokens from Solana Tracker API
async function fetchTokens() {
  try {
    const response = await fetch('https://data.solanatracker.io/search?name=x402&symbol=x402', {
      headers: { 'x-api-key': trackerApiKey }
    });
    const data = await response.json();
    allTokens = data.tokens || [];
    sortAndDisplay();
  } catch (error) {
    console.error('Error fetching tokens:', error);
    feed.innerHTML = '<p>Unable to fetch tokens. Check your API key or network.</p>';
  }
}

// Sorting
function sortAndDisplay() {
  if (currentSort === 'newest') {
    allTokens.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (currentSort === 'volume') {
    allTokens.sort((a, b) => (b.volume || 0) - (a.volume || 0));
  }
  displayTokens(allTokens);
}

// Display tokens
function displayTokens(tokens) {
  feed.innerHTML = '';
  if (tokens.length === 0) {
    feed.innerHTML = '<p>No x402 tokens found.</p>';
    return;
  }
  tokens.forEach(token => {
    const tokenElement = document.createElement('div');
    tokenElement.className = 'token';
    tokenElement.innerHTML = `
      <strong>${token.name || 'N/A'} (${token.symbol || 'N/A'})</strong><br>
      <span class="small">Creator: ${token.creator || 'N/A'}</span><br>
      <span class="small">Volume: ${token.volume || 'N/A'} • Created: ${token.createdAt || 'N/A'}</span>
    `;
    feed.appendChild(tokenElement);
  });
}

// Sort buttons
sortNewestBtn.addEventListener('click', () => {
  currentSort = 'newest';
  sortAndDisplay();
});
sortVolumeBtn.addEventListener('click', () => {
  currentSort = 'volume';
  sortAndDisplay();
});

// Initial load
fetchTokens();

// Auto-refresh every 5 minutes
setInterval(() => {
  fetchTokens();
}, 300000);
