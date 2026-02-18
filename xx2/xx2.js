(function () {
  var activeTab = 'library';
  var navItems = document.querySelectorAll('.nav-e2-item[data-tab]');
  var addBtn = document.querySelector('.nav-add-e2');
  var addWrap = document.querySelector('.nav-add-e2-wrap');
  var addMenu = document.getElementById('add-menu');

  // Click sound: new Audio per click so it always works (no reuse = no browser blocking)
  document.addEventListener('mousedown', function (e) {
    if (!e.target.closest('button')) return;
    var a = new Audio('../assets/click.mp3');
    a.play().catch(function () {});
  }, true);

  function setActive(tab) {
    if (tab !== 'sublime' && tab !== 'library' && tab !== 'inbox') return;
    activeTab = tab;
    navItems.forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-tab') === tab);
    });
    if (addBtn) addBtn.classList.toggle('is-visible', tab === 'library');
    if (tab !== 'library' && addWrap) addWrap.classList.remove('is-expanded');
  }

  navItems.forEach(function (el) {
    el.addEventListener('click', function () {
      var tab = el.getAttribute('data-tab');
      if (tab === activeTab) return;
      setActive(tab);
    });
  });

  if (addBtn) addBtn.classList.toggle('is-visible', activeTab === 'library');

  // Plus button: toggle actions menu and rotate icon
  if (addBtn && addWrap) {
    addBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!addBtn.classList.contains('is-visible')) return;
      addWrap.classList.toggle('is-expanded');
      addBtn.setAttribute('aria-expanded', addWrap.classList.contains('is-expanded'));
      if (addMenu) addMenu.setAttribute('aria-hidden', !addWrap.classList.contains('is-expanded'));
    });
  }

  // Click outside to close menu
  document.addEventListener('click', function () {
    if (addWrap && addWrap.classList.contains('is-expanded')) {
      addWrap.classList.remove('is-expanded');
      if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
      if (addMenu) addMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Prevent menu clicks from closing (they bubble to document)
  if (addMenu) {
    addMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  // Action buttons (placeholder handlers)
  document.querySelectorAll('.nav-add-e2-action[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (this.getAttribute('data-action') === 'import') return;
      var action = this.getAttribute('data-action');
      console.log('Action:', action);
    });
  });

  document.querySelectorAll('.nav-add-e2-submenu-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var source = this.getAttribute('data-import');
      console.log('Import from:', source);
    });
  });

  // Import submenu: hover with delay; open/close state on section so submenu can bottom-align with it
  var importSection = document.getElementById('import-section');
  var importRow = document.getElementById('import-row');
  var importSubmenu = document.getElementById('import-submenu');
  var submenuCloseTimer = null;
  var SUBMENU_CLOSE_DELAY = 200;

  function openSubmenu() {
    if (!importSection || !importSubmenu) return;
    if (submenuCloseTimer) {
      clearTimeout(submenuCloseTimer);
      submenuCloseTimer = null;
    }
    importSection.classList.add('is-submenu-open');
    importRow?.querySelector('.nav-add-e2-action[data-action="import"]')?.setAttribute('aria-expanded', 'true');
    positionSubmenu();
  }

  function closeSubmenu() {
    if (!importSection) return;
    importSection.classList.remove('is-submenu-open');
    importRow?.querySelector('.nav-add-e2-action[data-action="import"]')?.setAttribute('aria-expanded', 'false');
  }

  function scheduleCloseSubmenu() {
    if (submenuCloseTimer) clearTimeout(submenuCloseTimer);
    submenuCloseTimer = setTimeout(function () {
      submenuCloseTimer = null;
      closeSubmenu();
    }, SUBMENU_CLOSE_DELAY);
  }

  function positionSubmenu() {
    if (!importSubmenu || !importSection) return;
    importSubmenu.classList.remove('nav-add-e2-submenu--open-up');
    importSubmenu.offsetHeight;
    var sectionRect = importSection.getBoundingClientRect();
    var submenuHeight = importSubmenu.offsetHeight;
    var viewportH = window.innerHeight;
    var safeMargin = 16;
    var wouldGoBelow = sectionRect.top + submenuHeight > viewportH - safeMargin;
    if (wouldGoBelow) {
      importSubmenu.classList.add('nav-add-e2-submenu--open-up');
    }
  }

  if (importSection && importRow && importSubmenu) {
    importRow.addEventListener('mouseenter', openSubmenu);
    importRow.addEventListener('mouseleave', scheduleCloseSubmenu);
    importSubmenu.addEventListener('mouseenter', openSubmenu);
    importSubmenu.addEventListener('mouseleave', scheduleCloseSubmenu);
  }

  // Close Import submenu when main add menu closes
  if (addWrap) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'class' && !addWrap.classList.contains('is-expanded')) {
          closeSubmenu();
        }
      });
    });
    observer.observe(addWrap, { attributes: true });
  }
})();
