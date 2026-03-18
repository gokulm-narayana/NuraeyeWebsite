class AppHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Find out the path relative to the root directory
        const basePath = this.getAttribute('base-path') || '.';

        this.innerHTML = `
    <!-- Header Section -->
    <header class="navbar" id="navbar">
        <div class="navbar-container">

            <!-- Left: Logo -->
            <a href="${basePath}/index.html" class="logo">
                <img src="${basePath}/pictures/image.png" alt="Nuraeye Logo" class="logo-img">
            </a>

            <!-- Middle: Navigation Links -->
            <nav class="nav-links" id="nav-links">
                <div class="nav-item dropdown">
                    <span class="dropdown-trigger">Products <i class="fas fa-chevron-down"></i></span>
                    <div class="dropdown-menu">
                        <div class="dropdown-item dropdown-submenu">
                            <span class="submenu-trigger">WiFi Camera <i class="fas fa-chevron-right"></i></span>
                            <div class="submenu-menu">
                                <a href="${basePath}/products/wifi-bullet-camera.html" class="dropdown-item">WiFi Bullet Camera</a>
                                <a href="${basePath}/products/wifi-ptz-camera.html" class="dropdown-item">WiFi PTZ Camera</a>
                                <a href="${basePath}/products/wifi-dome-camera.html" class="dropdown-item">WiFi Dome Camera</a>
                            </div>
                        </div>
                        <div class="dropdown-item dropdown-submenu">
                            <span class="submenu-trigger">IP Camera <i class="fas fa-chevron-right"></i></span>
                            <div class="submenu-menu">
                                <a href="${basePath}/products/ai-bullet-camera.html" class="dropdown-item">AI Bullet Camera</a>
                                <a href="${basePath}/products/ai-ptz-camera.html" class="dropdown-item">AI PTZ Camera</a>
                                <a href="${basePath}/products/ai-dome-camera.html" class="dropdown-item">AI Dome Camera</a>
                            </div>
                        </div>
                        <a href="${basePath}/products/nvr.html" class="dropdown-item">NVR</a>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-header">Software</div>
                        <a href="${basePath}/products/vms-software.html" class="dropdown-item">VMS Software</a>
                    </div>
                </div>
                <div class="nav-item dropdown">
                    <span class="dropdown-trigger">Solutions <i class="fas fa-chevron-down"></i></span>
                    <div class="dropdown-menu">
                        <a href="${basePath}/solutions/industry-based/gated-communities.html" class="dropdown-item">Gated Communities</a>
                        <a href="${basePath}/solutions/industry-based/education.html" class="dropdown-item">Education</a>
                        <a href="${basePath}/solutions/industry-based/banking.html" class="dropdown-item">Banking</a>
                        <a href="${basePath}/solutions/industry-based/healthcare.html" class="dropdown-item">Healthcare</a>
                        <a href="${basePath}/solutions/industry-based/smart-city.html" class="dropdown-item">Smart &amp; Safe City</a>
                        <a href="${basePath}/solutions/industry-based/retail.html" class="dropdown-item">Retail</a>
                        <a href="${basePath}/solutions/industry-based/manufacturing.html" class="dropdown-item">Manufacturing Warehouse</a>
                        <a href="${basePath}/solutions/industry-based/construction.html" class="dropdown-item">Construction Site</a>
                    </div>
                </div>
                <div class="nav-item dropdown">
                    <span class="dropdown-trigger">Company <i class="fas fa-chevron-down"></i></span>
                    <div class="dropdown-menu">
                        <a href="${basePath}/company/about.html" class="dropdown-item">About Us</a>
                        <a href="${basePath}/company/news.html" class="dropdown-item">In the News</a>
                        <a href="${basePath}/company/careers.html" class="dropdown-item">Careers</a>
                    </div>
                </div>
            </nav>

            <!-- Right: Contact Us Button & Mobile Toggle -->
            <div class="nav-actions">
                <a href="${basePath}/contact.html" class="btn btn-primary">Contact Us</a>
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle Menu">
                    <i class="fas fa-bars"></i>
                </button>
            </div>

        </div>
    </header>
        `;

        // Angular-style Component Methods
        this.initializeNavbar();
    }

    initializeNavbar() {
        const navbar = this.querySelector('#navbar');
        const mobileMenuToggle = this.querySelector('#mobile-menu-toggle');
        const navLinks = this.querySelector('#nav-links');
        const menuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;

        if (!navbar || !mobileMenuToggle || !navLinks) return;

        // 1. Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // 2. Mobile Menu Toggle
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');

            // Toggle icon between bars and times (close)
            if (navLinks.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu open

                // Add close button inside the drawer if it doesn't exist
                if (!this.querySelector('#mobile-drawer-close')) {
                    const closeBtn = document.createElement('button');
                    closeBtn.id = 'mobile-drawer-close';
                    closeBtn.className = 'mobile-drawer-close';
                    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    navLinks.insertBefore(closeBtn, navLinks.firstChild);

                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        navLinks.classList.remove('active');
                        menuIcon.classList.remove('fa-times');
                        menuIcon.classList.add('fa-bars');
                        document.body.style.overflow = '';

                        // Close all dropdowns when main menu is closed
                        this.querySelectorAll('.dropdown, .dropdown-submenu').forEach(dropdown => {
                            dropdown.classList.remove('active');
                        });
                    });
                }

                // Generate Mobile Contact Button if it doesn't exist
                if (!this.querySelector('#mobile-contact-btn')) {
                    const navBtn = this.querySelector('.nav-actions .btn-primary');
                    if (navBtn) {
                        const navBtnClone = navBtn.cloneNode(true);
                        navBtnClone.id = 'mobile-contact-btn';
                        navBtnClone.classList.add('mobile-contact-btn');
                        navBtnClone.style.display = 'flex';
                        navBtnClone.style.justifyContent = 'center';
                        navLinks.appendChild(navBtnClone);
                    }
                }
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
                document.body.style.overflow = '';

                // Close all dropdowns when main menu is closed
                this.querySelectorAll('.dropdown, .dropdown-submenu').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });

        // 3. Accordion Dropdown functionality for Mobile
        const dropdownTriggers = this.querySelectorAll('.dropdown-trigger, .submenu-trigger');

        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();

                    const parent = trigger.parentElement;

                    // If it's a top-level dropdown, close other top-level dropdowns
                    if (parent.classList.contains('dropdown')) {
                        this.querySelectorAll('.dropdown').forEach(dropdown => {
                            if (dropdown !== parent) {
                                dropdown.classList.remove('active');
                            }
                        });
                    }

                    // If it's a submenu, close other submenus inside the same dropdown
                    if (parent.classList.contains('dropdown-submenu')) {
                        const siblingSubmenus = parent.parentElement.querySelectorAll('.dropdown-submenu');
                        siblingSubmenus.forEach(submenu => {
                            if (submenu !== parent) {
                                submenu.classList.remove('active');
                            }
                        });
                    }

                    parent.classList.toggle('active');
                }
            });
        });

        // Close mobile menu when a direct link is clicked
        const allDirectLinks = this.querySelectorAll('.nav-links a:not(.dropdown-trigger):not(.submenu-trigger)');
        allDirectLinks.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
            });
        });
    }
}

class AppFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';

        this.innerHTML = `
    <!-- Footer Section -->
    <footer class="footer">
        <div class="container">
            <div class="footer-top">

                <!-- 1. Brand -->
                <div class="footer-brand">
                    <a href="${basePath}/index.html" class="footer-logo">
                        <img src="${basePath}/pictures/image.png" alt="Nuraeye Logo">
                    </a>
                    <p class="footer-description">
                        Empowering industries with innovative AI surveillance solutions. Smart, scalable, and secure
                        camera systems for every environment.
                    </p>
                    <div class="footer-socials">
                        <a href="#" class="footer-social-link"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" class="footer-social-link"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="footer-social-link"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>

                <!-- 2. Products -->
                <div>
                    <h4 class="footer-title">Products</h4>
                    <ul class="footer-links">
                        <li><a href="${basePath}/products/wifi-camera.html">WiFi Camera</a></li>
                        <li><a href="${basePath}/products/ip-camera.html">IP Camera</a></li>
                        <li><a href="${basePath}/products/nvr.html">NVR</a></li>
                        <li><a href="${basePath}/products/vms-software.html">VMS Software</a></li>
                    </ul>
                </div>

                <!-- 3. Company -->
                <div>
                    <h4 class="footer-title">Company</h4>
                    <ul class="footer-links">
                        <li><a href="${basePath}/company/about.html">About Us</a></li>
                        <li><a href="${basePath}/company/careers.html">Careers</a></li>
                        <li><a href="${basePath}/company/news.html">In the News</a></li>
                        <li><a href="${basePath}/contact.html">Contact Us</a></li>
                    </ul>
                </div>

                <!-- 4. Contact -->
                <div>
                    <h4 class="footer-title">Contact</h4>
                    <div class="footer-contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>3rd Floor, Subishi Town Center Commercial<br>Mokila, Hyderabad 501203<br>India</span>
                    </div>
                    <div class="footer-contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>info@nuraeye.com</span>
                    </div>
                    <div class="footer-contact-item">
                        <i class="fas fa-phone-alt"></i>
                        <span>+1 (800) 555-0199</span>
                    </div>
                </div>

            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-copyright">
                    &copy; 2026 Nuraeye. All rights reserved.
                </div>
                <div class="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
        `;
    }
}

// Register the custom Angular-style components
customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
