const form = document.getElementById('listingForm');
const resultDiv = document.getElementById('hostResult');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  // 1️⃣ Call Image Quality API
  const imageRes = await fetch('/api/image-quality', {
    method: 'POST',
    body: formData
  });
  const imageData = await imageRes.json();

  // 2️⃣ Call Fraud Check API
  const fraudRes = await fetch('/api/fraud-check', {
    method: 'POST',
    body: formData
  });
  const fraudData = await fraudRes.json();

  // 3️⃣ Show both results nicely
  resultDiv.innerHTML = `
    ✅ <strong>Image Quality:</strong> ${JSON.stringify(imageData)} <br>
    🔍 <strong>Fraud Check:</strong> ${JSON.stringify(fraudData)}
  `;
});
