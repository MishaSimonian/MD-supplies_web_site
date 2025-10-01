// Mobilné menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });
}

// Klik na "Do košíka"
document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-product-id');
    // TODO: pridať do košíka (localStorage / backend API)
    btn.classList.add('added');
    btn.textContent = 'Pridané';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.textContent = 'Do košíka';
    }, 1500);
  });
});
