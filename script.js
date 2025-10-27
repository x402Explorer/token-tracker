const feed = document.getElementById('feed');
const sortNewestBtn = document.getElementById('sortNewest');
const sortVolumeBtn = document.getElementById('sortVolume');

const moralisApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jOWRkLTc0YzMtNDNjZi1iMjlkLTYxZTA0MWQxOTdiNSIsIm9yZ0lkIjoiNDc4MjI5IiwidXNlcklkIjoiNDkxOTk4IiwidHlwZUlkIjoiOTE3ZDFiZjAtYmU4Ni00MzdkLTllMTgtZmZjYmY3ODA0ZTFlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NjE2MDMxNTUsImV4cCI6NDkxNzM2MzE1NX0.NBoV2mLrwOsVs44jb6tsvLb8nRMRdsIsGt4ui2HbCyw';

let allTokens = [];
let currentSort = 'newest'; // Default sort

async function fetchTokensPaginated(cursor = null) {
  try {
    const url = cursor 
      ? `https://solana-gateway.moralis.io/nft/mainnet/all?cursor=${cursor}` 
      : 'https://solana-gateway.moralis.io/nft/mainnet/all';

    const response = await fetch(url, {
      headers: { 'X-API-Key': moralisApiKey }
    });
    const data = await response.json();

    // Filter tokens with "x402" in name or symbol
    const filteredTokens = data.result.filter(token =>
      (token.name && token.name.toLowerCase().includes('x402')) ||
      (token.symbol && token.symbol.toLowerCase().includes('x402'))
    );

    allTokens.push(...filteredTokens);

    if (data.cursor) {
      return fetchTokensPaginated(data.cursor);
    } else {
      sortAndDisplay();
    }
  } catch (error) {
    console.error('Error fetching tokens:', error);
    feed.innerHTML = '<p>Unable to fetch tokens.</p>';
  }
}

function sortAndDisplay() {
  if (currentSort === 'newest') {
    allTokens.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (currentSort === 'volume') {
    allTokens.sort((a, b) => (b.volume || 0) - (a.volume || 0));
  }
  displayTokens(allTokens);
}

function displayTokens(tokens) {
  feed.innerHTML = '';
  tokens.forEach(token => {
    const tokenElement = document.createElement('div');
    tokenElement.className = 'token';
    tokenElement.innerHTML = `
      <strong>${token.name || 'N/A'} (${token.symbol || 'N/A'})</strong><br>
      <span class="small">Creator: ${token.creator || 'N/A'}</span><br>
      <span class="small">Volume: ${token.volume || 'N/A'} • Created: ${token.created || 'N/A'}</span>
    `;
    feed.appendChild(tokenElement);
  });
}

// Event listeners for sort buttons
sortNewestBtn.addEventListener('click', () => {
  currentSort = 'newest';
  sortAndDisplay();
});

sortVolumeBtn.addEventListener('click', () => {
  currentSort = 'volume';
  sortAndDisplay();
});

// Initial fetch
fetchTokensPaginated();

// Auto-refresh every 5 minutes
setInterval(() => {
  allTokens = [];
  fetchTokensPaginated();
}, 300000);
