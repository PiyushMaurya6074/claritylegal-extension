document.getElementById('scanYes').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "scan"}, (response) => {
      if (response && response.text) {
        fetch('https://app.base44.com/api/apps/68c575a09b8b0e9cd42fc679/entities/Analysis', {
          method: 'POST',
          headers: { 
            'api_key': 'b253e865037f4d8e81ac1b3b2e0d6a69',
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            text: response.text,
            document_id: Date.now(),
          })
        })
        .then(res => res.json())
        .then(data => {
          document.getElementById('result').style.display = 'block';
          document.getElementById('summary').textContent = data.summary || 'No summary';
          const meter = document.getElementById('riskMeter');
          meter.style.width = `${data.risk_score || 0}%`;
          meter.style.backgroundColor = data.risk_color || 'gray';
          const points = document.getElementById('keyPoints');
          points.innerHTML = (data.key_points || []).map(p => `<li style="color:${p.color || 'black'}">${p.text || 'No points'}</li>`).join('');
          document.getElementById('hiddenFees').innerHTML = (data.hidden_fees || []).map(f => `<span class="hidden-fee">${f || 'None'}</span>`).join('<br>');
        })
        .catch(error => console.error('API Error:', error));
      } else {
        alert('No Terms & Conditions found.');
      }
    });
  });
  hideButtons();
});

function hideButtons() {
  document.querySelectorAll('button:not(#close)').forEach(b => b.style.display = 'none');
}

document.getElementById('scanNo').addEventListener('click', () => window.close());
document.getElementById('close').addEventListener('click', () => window.close());