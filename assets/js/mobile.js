(function () {
	var desktopBreakpoint = '1024';
	var elms = {};

	function init() {
		setupBreakpoint();
		setupElms();
		setupEvents();
	}

	/**
	 * Setup Breakpoint
	 *
	 * Retrieve desktop breakpoint from body class
	 */
	function setupBreakpoint() {
		var desktopBreakpointClass = document.body.getAttribute("class").match(/wpbf-desktop-breakpoint-[\w-]*\b/);

		if (desktopBreakpointClass !== null) {
			var string = desktopBreakpointClass.toString();
			desktopBreakpoint = string.match(/\d+/);
		}
	}

	/**
	 * Setup elements necessary
	 */
	function setupElms() {
		elms.menuWrapper = document.querySelector('.wpbf-mobile-nav-wrapper');
		elms.menuToggle = document.querySelector('.wpbf-mobile-menu-toggle');
		elms.menuContainer = document.querySelector('.wpbf-mobile-menu-container');
		elms.mobileMegaMenu = document.querySelector('.wpbf-mobile-mega-menu');
		elms.megaMenu = document.querySelector('.wpbf-mega-menu');
		elms.mobileMenuLinks = document.querySelectorAll('.wpbf-mobile-menu a');
		elms.submenuToggle = document.querySelector('.wpbf-mobile-menu-default .wpbf-submenu-toggle');
	}

	/**
	 * Setup Events
	 * 
	 * Register events necessary
	 */
	function setupEvents() {
		if (!elms.menuContainer || !elms.menuToggle) {
			return;
		}

		elms.menuToggle.addEventListener('click', toggleMenu);

		if (elms.mobileMenuLinks.length) {
			[].slice.call(elms.mobileMenuLinks).forEach(function (el) {
				el.addEventListener('click', closeMenuWithoutSubmenu);
			});
		}


		if (elms.submenuToggle) {
			elms.submenuToggle.addEventListener('click', toggleSubmenu);
		}

		window.addEventListener('resize', adjustMenuOnResize);
	}

	/**
	 * Close menu only if menu item doesn't have submenus
	 */
	function closeMenuWithoutSubmenu() {
		var hasSubmenu = this.parentNode.classList.contains('menu-item-has-children');

		if (this.href.match("^#") || this.href.match("^/#")) {
			if (hasSubmenu) {
				toggleSubmenuOnEmptyLink(this);
			} else {
				toggleMenu();
			}
		}
	}

	/**
	 * Toggle mobile menu
	 */
	function toggleMenu() {
		if (elms.menuToggle.classList.contains("active")) {
			elms.menuContainer.classList.remove('active');
			elms.menuContainer.classList.remove('slide-down'); // Slide up.

			elms.menuToggle.classList.remove("active");
			elms.menuToggle.setAttribute('aria-expanded', 'false');
		} else {
			elms.menuContainer.classList.add('active');
			elms.menuContainer.classList.add('slide-down'); // Slide down.

			elms.menuToggle.classListadd("active");
			elms.menuToggle.setAttribute('aria-expanded', 'true');

			window.dispatchEvent(new Event('resize'));
		}

	}

	/**
	 * Close menu
	 */
	function closeMenu() {
		if (elms.menuToggle.classList.contains("active")) {
			elms.menuContainer.classList.remove('active');
			elms.menuContainer.classList.remove('slide-down'); // Slide up.

			elms.menuToggle.classList.remove("active");
			elms.menuToggle.setAttribute('aria-expanded', 'false');
		}
	}

	/**
	 * Submenu toggle arrow
	 */
	function toggleSubmenu() {
		if (this.classList.contains("active")) {
			submenuToggle(this, true);
		} else {
			submenuToggle(this, false);
		}
	}

	/**
	 * Toggle submenu on empty link
	 * 
	 * @param object el HTMLElement.
	 */
	function toggleSubmenuOnEmptyLink(elm) {
		var submenuToggles = [].filter.call(elm.parentNode.children, function (child) {
			return child !== elm && child.classList.contains('wpbf-submenu-toggle');
		});

		[].slice.call(submenuToggles).forEach(function (el) {
			if (el.classList.contains("active")) {
				submenuToggle(el, true);
			} else {
				submenuToggle(el, false);
			}
		});
	}

	/**
	 * Manipulate classes of submenuToggle
	 * 
	 * @param HTMLElement el The submenu toggle.
	 * @param bool hasActiveClass Whether the "el" parameter has "active" class or not.
	 */
	function submenuToggle(el, hasActiveClass) {
		var stringToRemove = hasActiveClass ? 'up' : 'down';
		var stringToAdd = hasActiveClass ? 'down' : 'up';
		var mode = hasActiveClass ? 'remove' : 'add';
		var setExpand = hasActiveClass ? 'false' : 'true';

		var icons = el.querySelectorAll('i');
		var subMenus = [].filter.call(el.parentNode.children, function (child) {
			return child !== el && child.classList.contains('sub-menu');
		});

		el.classList.remove('wpbff-arrow-' + stringToRemove);
		el.classList.add('wpbff-arrow-' + stringToAdd);

		[].slice.call(icons).forEach(function (icon) {
			icon.classList.remove('wpbff-arrow-' + stringToRemove);
			icon.classList.add('wpbff-arrow-' + stringToAdd);
		});

		el.classList[mode]('active');
		el.setAttribute('aria-expanded', setExpand);

		[].slice.call(subMenus).forEach(function (subMenu) {
			subMenu.classList[mode]('slide-down'); // Slide up/ down.
		});
	}

	/**
	 * Resize Fallback
	 *
	 * Hide open mobile menu on window resize.
	 */
	function adjustMenuOnResize() {
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var mobileNavWrapperHeight = 0;
		var activeNav = document.querySelector('.wpbf-mobile-menu-container.active nav');

		if (elms.menuWrapper) {
			mobileNavWrapperHeight = elms.menuWrapper.offsetHeight;
		}

		if (activeNav) {
			activeNav.style.maxHeight = (windowHeight - mobileNavWrapperHeight) + 'px';
		}

		if (windowWidth > desktopBreakpoint) {
			closeMenu();

			if (elms.mobileMegaMenu) {
				elms.mobileMegaMenu.classList.remove('wpbf-mobile-mega-menu');
				elms.mobileMegaMenu.classList.add('wpbf-mega-menu');
			}
		} else {
			if (elms.megaMenu) {
				elms.megaMenu.classList.remove('wpbf-mega-menu');
				elms.megaMenu.classList.add('wpbf-mobile-mega-menu');
			}
		}
	}

	init();
})();