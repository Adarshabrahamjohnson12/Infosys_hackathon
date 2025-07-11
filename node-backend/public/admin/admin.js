window.addEventListener('DOMContentLoaded', async () => {
  const staysContainer = document.getElementById('staysContainer');
  const bookingsContainer = document.getElementById('bookingsContainer');

  // 👉 Fetch stays
  const staysRes = await fetch('/api/stays');
  const stays = await staysRes.json();

  stays.forEach(stay => {
    const stayCard = document.createElement('div');
    stayCard.className = 'card';
    stayCard.innerHTML = `
      <h3>${stay.name}</h3>
      <p>${stay.description}</p>
      <p>Flagged: ${stay.flagged ? '✅' : '❌'}</p>
      <button class="flag-btn" onclick="flagStay(${stay.id})">Flag Stay</button>
    `;
    staysContainer.appendChild(stayCard);
  });

  // 👉 Fetch bookings
  const bookingsRes = await fetch('/api/bookings');
  const bookings = await bookingsRes.json();

  bookings.forEach(b => {
    const bookingCard = document.createElement('div');
    bookingCard.className = 'card';
    bookingCard.innerHTML = `
      <p>Stay ID: ${b.stayId}</p>
      <p>User: ${b.userName}</p>
      <p>Date: ${new Date(b.date).toLocaleString()}</p>
    `;
    bookingsContainer.appendChild(bookingCard);
  });
});

// ✅ Flag Stay function
async function flagStay(stayId) {
  const res = await fetch(`/api/flag/${stayId}`, { method: 'POST' });
  const data = await res.json();
  alert(data.msg);
  location.reload();
}
