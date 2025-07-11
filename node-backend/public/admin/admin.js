const flaggedData = [
  { stay: "Green Farm Stay", issue: "Duplicate Image", status: "Pending" },
  { stay: "Riverside Cottage", issue: "Low Image Quality", status: "Pending" }
];

const tableBody = document.getElementById('flaggedTable');

flaggedData.forEach(item => {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${item.stay}</td>
    <td>${item.issue}</td>
    <td>${item.status}</td>
    <td>
      <button onclick="approve('${item.stay}')">Approve</button>
      <button onclick="reject('${item.stay}')">Reject</button>
    </td>
  `;

  tableBody.appendChild(row);
});

function approve(stay) {
  alert(`✅ Approved: ${stay} (Later this will update status)`);
}

function reject(stay) {
  alert(`❌ Rejected: ${stay} (Later this will update status)`);
}
