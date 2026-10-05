// WRS Practice — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  // Subtle hover effect on record cards
  document.querySelectorAll('.record-card--active').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--hover', '1');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--hover', '0');
    });
  });
});
