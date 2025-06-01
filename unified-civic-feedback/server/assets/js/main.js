// Initialize map
let map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

let marker;
map.on('click', function(e) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker(e.latlng).addTo(map);
  document.getElementById('latitude').value = e.latlng.lat;
  document.getElementById('longitude').value = e.latlng.lng;
});

// Submit new issue
const form = document.getElementById('issue-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    const response = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, category, latitude, longitude }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Issue submitted! Your ID: ' + result.id);
      window.location.href = '/status?id=' + result.id;
    } else {
      alert('Error: ' + result.error);
    }
  });
}

// Check status of existing issue
const statusForm = document.getElementById('status-form');
if (statusForm) {
  statusForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const issueId = document.getElementById('issue-id').value;
    const response = await fetch(`/api/issues/${issueId}`);
    const result = await response.json();
    const container = document.getElementById('status-result');
    if (response.ok) {
      container.innerHTML = `<p><strong>Status:</strong> ${result.status}</p>
                             <p><strong>Description:</strong> ${result.description}</p>`;
    } else {
      container.innerHTML = `<p>Issue not found.</p>`;
    }
  });
}