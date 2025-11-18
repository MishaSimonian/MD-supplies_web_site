document.addEventListener('DOMContentLoaded', () => {
  if(window.__auth) window.__auth.updateHeaderAuthUI();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if(!id){ document.getElementById('order-detail').innerHTML = '<p>Chýba ID objednávky.</p>'; return; }

  const orders = JSON.parse(localStorage.getItem('orders')||'[]');
  const order = orders.find(o => o.id === id);
  if(!order){ document.getElementById('order-detail').innerHTML = '<p>Objednávka nebola nájdená.</p>'; return; }

  const sessionUserId = localStorage.getItem('sessionUserId');
  if(!sessionUserId || sessionUserId !== order.userId){
    alert('Nemáte oprávnenie zobraziť túto objednávku.');
    window.location.href = sessionUserId ? 'account.html' : 'auth.html';
    return;
  }

  const container = document.getElementById('order-detail');
  const header = document.createElement('div');
  header.innerHTML = `<p><strong>ID objednávky:</strong> ${order.id}</p>
    <p><strong>Dátum:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
    <p><strong>Spolu:</strong> €${order.total.toFixed(2)}</p>
    <p><strong>Stav:</strong> ${order.status}</p>`;
  const containerMeta = document.createElement('div');
  containerMeta.className = 'order-meta';
  containerMeta.appendChild(header);

  // Build semantic table and rely on CSS for widths/alignment
  const table = document.createElement('table');
  table.className = 'order-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Produkt</th><th class="col-price">Cena</th><th class="col-qty">Množstvo</th><th class="col-subtotal">Medzisúčet</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  order.items.forEach(item => {
    const tr = document.createElement('tr');
    const subtotal = (item.price * item.quantity).toFixed(2);
    tr.innerHTML = `
      <td>${item.name}</td>
      <td class="col-price">€${item.price.toFixed(2)}</td>
      <td class="col-qty">${item.quantity}</td>
      <td class="col-subtotal">€${subtotal}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totals row in tfoot
  const tfoot = document.createElement('tfoot');
  tfoot.innerHTML = `<tr class="order-total-row"><td></td><td></td><td class="label-total">Spolu</td><td class="value-total">€${order.total.toFixed(2)}</td></tr>`;

  table.appendChild(tbody);
  table.appendChild(tfoot);

  container.appendChild(containerMeta);
  container.appendChild(table);
});
