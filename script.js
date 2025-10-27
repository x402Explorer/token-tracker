const feed = document.getElementById('feed');

// Function to fetch x402 tokens
function fetchTokens() {
  fetch('https://api.pump.fun/v1/tokens?protocol=x402') // placeholder URL
    .then(response => response.json())
    .then(data => {
      feed.innerHTML = ''; // Clear old tokens
      data.tokens.reverse().forEach(token => {
        const tokenElement = document.createElement('div');
        tokenElement.className = 'token';
        tokenElement.innerHTML = `
          <strong>${token.name} (${token.symbol})</strong><br>
          <span class="small">Creator: ${token.creator}</span><br>
          <span class="small">Volume: ${token.volume} • Created: ${token.created}</span>
        `;
        feed.appendChild(tokenElement);
      });
    })
    .catch(error => {
      feed.innerHTML = "<p>Unable to fetch tokens automatically.</p>";
      console.error(error);
    });
}

// Initial fetch
fetchTokens();

// Auto-refresh every 5 minutes (300000 ms)
setInterval(fetchTokens, 300000);
