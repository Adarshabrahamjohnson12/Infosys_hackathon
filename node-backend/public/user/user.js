// Load stays when page loads
window.addEventListener('DOMContentLoaded', async () => {
  const staysContainer = document.getElementById('staysContainer');

  // Fetch stays
  const response = await fetch('/api/stays');
  const stays = await response.json();

  stays.forEach(stay => {
    const stayCard = document.createElement('div');
    stayCard.className = 'stay-card';

    stayCard.innerHTML = `
      <img src="https://source.unsplash.com/400x300/?village,house,${Math.random()}" alt="Stay Image" />
      <h3>${stay.name}</h3>
      <p>${stay.description}</p>
      <button class="book-btn" onclick="bookStay(${stay.id})">Book Now</button>
    `;

    staysContainer.appendChild(stayCard);
  });
});

// Book stay function
async function bookStay(stayId) {
  const userName = prompt('Enter your name to confirm booking:');
  const bookingDate = new Date().toISOString();

  const res = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stayId: stayId,
      userName: userName,
      date: bookingDate
    })
  });

  const data = await res.json();
  alert(data.msg);
}
