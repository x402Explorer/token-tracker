fetch('data.json')
  .then(res => res.json())
  .then(tokens => {
    const feed = document.getElementById('feed');
    tokens.reverse().forEach(t => {
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
  .catch(err => console.error(err));
