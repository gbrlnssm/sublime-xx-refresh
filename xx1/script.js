(function () {
  var activeTab = 'sublime';
  var navItems = document.querySelectorAll('.nav-item[data-tab]');

  function setActive(tab) {
    if (tab !== 'sublime' && tab !== 'myLibrary' && tab !== 'inbox') return;
    activeTab = tab;
    navItems.forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-tab') === tab);
    });
  }

  navItems.forEach(function (el) {
    el.addEventListener('click', function () {
      var tab = el.getAttribute('data-tab');
      if (tab === activeTab) return;
      setActive(tab);
    });
  });
})();
