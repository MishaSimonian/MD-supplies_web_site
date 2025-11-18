
let cart = [];

function generateId(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Render cart and update UI
function renderCart() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Košík je prázdny.</p>';
    cartTotal.textContent = '';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    if (clearCartBtn) clearCartBtn.style.display = 'none';
    return;
  }

  let total = 0;
  cartItems.innerHTML = '<ul class="cart-list">' + cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `<li>
      <div class="cart-item-row">
        <div class="cart-item-info"><strong>${item.name}</strong></div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn" data-action="decrease" data-index="${index}">−</button>
            <span class="qty-value" data-index="${index}">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
          </div>
          <div class="cart-item-price">€${item.price.toFixed(2)}</div>
          <div class="cart-item-sub">€${itemTotal.toFixed(2)}</div>
          <button class="btn-remove" data-index="${index}">Odstrániť</button>
        </div>
      </div>
    </li>`;
  }).join('') + '</ul>';

  cartTotal.textContent = `Celková suma: €${total.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
  if (clearCartBtn) clearCartBtn.style.display = 'inline-block';

  // Remove individual item from cart with fade-out animation
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      btn.parentElement.classList.add('fade-out');
      setTimeout(() => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }, 400);
    });
  });

  // Quantity controls (increase / decrease)
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      const action = btn.getAttribute('data-action');
      if (Number.isNaN(index) || !cart[index]) return;
      if (action === 'increase') {
        cart[index].quantity = (cart[index].quantity || 0) + 1;
      } else if (action === 'decrease') {
        cart[index].quantity = (cart[index].quantity || 0) - 1;
        if (cart[index].quantity <= 0) {
          // remove item if quantity zero
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
          return;
        }
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });
}

// Clear all items from cart
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  const clearCartBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      const cartList = document.querySelector('.cart-list');
      if (cartList) {
        cartList.classList.add('fade-out-all');
        setTimeout(() => {
          localStorage.removeItem('cart');
          renderCart();
        }, 500);
      } else {
        localStorage.removeItem('cart');
        renderCart();
      }
    });
  }

  if(checkoutBtn){
    checkoutBtn.addEventListener('click', () => {
      const sessionUserId = localStorage.getItem('sessionUserId');
      if(!sessionUserId){
        alert('Musíte sa prihlásiť alebo zaregistrovať, aby ste zadali objednávku');
        setTimeout(()=> window.location.href = 'auth.html', 300);
        return;
      }

      cart = JSON.parse(localStorage.getItem('cart')) || [];
      if(cart.length === 0){
        alert('Košík je prázdny');
        return;
      }
      const total = cart.reduce((s,i)=> s + (i.price * i.quantity), 0);
      const orders = JSON.parse(localStorage.getItem('orders')||'[]');
      const order = {
        id: generateId(),
        userId: sessionUserId,
        items: cart,
        total: parseFloat(total.toFixed(2)),
        createdAt: new Date().toISOString(),
        status: 'demo'
      };
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.removeItem('cart');
      renderCart();
      alert('Objednávka bola uložená');
      window.location.href = 'account.html';
    });
  }
});


// Animate logo and headings on page load
window.addEventListener('DOMContentLoaded', () => {
  // Logo animation
  const brandName = document.querySelector('.brand-name');
  if (brandName) {
    brandName.classList.add('tracking-in-expand');
  }

  // Animate section headings letter by letter when in viewport
  const h2s = document.querySelectorAll('.animate-heading');
  h2s.forEach(h2 => {
    const text = h2.textContent;
    h2.textContent = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('slide-in-letter');
      if (char === ' ') span.classList.add('space');
      span.style.animationDelay = (i * 0.06) + 's';
      span.style.animationPlayState = 'paused';
      h2.appendChild(span);
    });
  });

  // Trigger heading animation when in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.slide-in-letter').forEach(span => {
            span.style.animationPlayState = 'running';
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    h2s.forEach(h2 => observer.observe(h2));
  } else {
    h2s.forEach(h2 => h2.querySelectorAll('.slide-in-letter').forEach(span => {
      span.style.animationPlayState = 'running';
    }));
  }
});