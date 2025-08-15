// Favour Collection - slider.js
// Swiper initialization for homepage product slider

// Ensure Swiper assets are included via CDN in HTML

window.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.swiper');
  if (!el || typeof Swiper === 'undefined') return;
  new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
});