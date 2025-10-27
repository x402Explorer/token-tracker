const feed = document.getElementById('feed');

// Fetch new tokens from Pump.fun API
fetch('https://api.pump.fun/v1/tokens?protocol=x402')
  .then(res => res.json())
  .then(data => {
    feed.innerHTML = ''; // Clear previous tokens
    data.tokens.reverse().forEach(t => {
      const div = document.createElement('div');
      div.className = 'token';
      div.innerHTML = `
        <strong>${t.name} (${t.symbol})</strong><br>
        <span class="small">Creator: ${t.creator}</span><br>
        <span class="small">Volume: ${t.volume} • Created: ${t.created}</span>
      `;
      feed.appendChild(div);
    });
  })
  .catch(err => {
    feed.innerHTML = "<p>Unable to fetch tokens automatically.</p>";
    console.error(err);
  });
