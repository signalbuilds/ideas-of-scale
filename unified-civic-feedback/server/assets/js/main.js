// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // 1. Leaflet map initialization (only if <div id="map"> is present)
  const mapContainer = document.getElementById("map");
  if (mapContainer) {
    // Initialize Leaflet map
    let map = L.map("map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Place a marker on click and fill hidden inputs
    let marker = null;
    map.on("click", function (e) {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(e.latlng).addTo(map);
      document.getElementById("latitude").value = e.latlng.lat;
      document.getElementById("longitude").value = e.latlng.lng;
    });
  }

  // 2. Handle issue submission form (index.html)
  const issueForm = document.getElementById("issue-form");
  if (issueForm) {
    issueForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value.trim();
      const category = document.getElementById("category").value;
      const latitude = parseFloat(
        document.getElementById("latitude").value
      );
      const longitude = parseFloat(
        document.getElementById("longitude").value
      );

      if (!description || isNaN(latitude) || isNaN(longitude)) {
        alert("Please enter all required fields and select a location on the map.");
        return;
      }

      try {
        const response = await fetch("/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            category,
            latitude,
            longitude,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          // If the server returns { "id": 1, ... }
          alert("Issue submitted! Your ID: " + (result.id || result.ID));
          const issueId = result.id || result.ID;
          window.location.href = "/status?id=" + issueId;
        } else {
          alert("Error: " + (result.error || JSON.stringify(result)));
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  }

  // 3. Handle status lookup form (status.html)
  const statusForm = document.getElementById("status-form");
  if (statusForm) {
    // Prefill the input if ?id=... is in the URL
    const params = new URLSearchParams(window.location.search);
    const prefillId = params.get("id");
    if (prefillId) {
      document.getElementById("issue-id").value = prefillId;
      // Optionally auto-submit:
      // statusForm.requestSubmit();
    }

    statusForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const issueId = document.getElementById("issue-id").value.trim();
      if (!issueId) {
        alert("Please enter an Issue ID.");
        return;
      }
      try {
        const response = await fetch(`/api/issues/${issueId}`);
        const result = await response.json();
        const container = document.getElementById("status-result");
        if (response.ok) {
          container.innerHTML = `
            <p><strong>Issue ID:</strong> ${result.id || result.ID}</p>
            <p><strong>Status:</strong> ${result.status}</p>
            <p><strong>Description:</strong> ${result.description}</p>
            <p><strong>Category:</strong> ${result.category}</p>
            <p><strong>Location:</strong> ${result.latitude}, ${result.longitude}</p>
          `;
        } else {
          container.innerHTML = `<p>Issue not found.</p>`;
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  }
});
// Wait until DOM is fully parsed (and Leaflet is loaded)
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Leaflet map—but only if #map exists
  const mapContainer = document.getElementById("map");
  if (mapContainer) {
    // Center on India by default
    const map = L.map("map").setView([20.5937, 78.9629], 5);

    // OSM tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Allow user to click & place a marker
    let marker = null;
    map.on("click", (e) => {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(e.latlng).addTo(map);
      document.getElementById("latitude").value = e.latlng.lat;
      document.getElementById("longitude").value = e.latlng.lng;
    });
  }

  // 2. Issue submission form logic
  const issueForm = document.getElementById("issue-form");
  if (issueForm) {
    issueForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document.getElementById("description").value.trim();
      const category = document.getElementById("category").value;
      const latitude = parseFloat(
        document.getElementById("latitude").value
      );
      const longitude = parseFloat(
        document.getElementById("longitude").value
      );

      if (!description || isNaN(latitude) || isNaN(longitude)) {
        alert("Please fill in all fields and pick a location on the map.");
        return;
      }

      try {
        const response = await fetch("/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            category,
            latitude,
            longitude,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          const newId = result.id || result.ID;
          alert("Issue submitted! Your ID: " + newId);
          window.location.href = "/status?id=" + newId;
        } else {
          alert("Error: " + (result.error || JSON.stringify(result)));
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  }
});
