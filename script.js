// Smooth scroll for all anchor nav links
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var offset = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
