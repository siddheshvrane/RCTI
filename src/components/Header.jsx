import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import eventBus from '../services/eventBus';
import './Header.css';
import rctiHeaderLogo from '../assets/RCTI_header.jpeg';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();
    const navigate = useNavigate();

    const isCourseDetailPage = location.pathname.startsWith('/courses/');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        const activeSectionSubscription = eventBus.onActiveSection().subscribe((data) => {
            setActiveSection(data.section);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            activeSectionSubscription.unsubscribe();
        };
    }, []);

    const handleNavClick = async (section) => {
        setIsMobileMenuOpen(false);

        if (isCourseDetailPage) {
            if (section === 'home') {
                navigate('/');
                window.scrollTo(0, 0);
                return;
            }
            if (section === 'courses' || section === 'contact') {
                navigate('/');
                // Wait for navigation
                setTimeout(() => {
                    const element = document.getElementById(section);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        eventBus.emitNavigation({ section });
                    }
                }, 100);
                return;
            }
            if (section === 'about-course' || section === 'faculty' || section === 'testimonials') {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }
        }

        if (section === 'home') {
            if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            } else {
                navigate('/');
                window.scrollTo(0, 0);
                return;
            }
        }

        // Standard home page navigation
        eventBus.emitNavigation({ section });

        // If we are on some other page and clicking a home section (nav item with id), navigate home first
        if (location.pathname !== '/' && !section.startsWith('/')) {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
            return;
        }

        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);
        eventBus.emitUIState({ mobileMenuOpen: newState });
    };

    const defaultNavItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'courses', label: 'Courses' },
        { id: 'faculty', label: 'Faculty' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'life-at-rcti', label: 'Gallery' },
        { id: 'contact', label: 'Register' },
    ];

    const courseDetailNavItems = [
        { id: 'home', label: 'Home' },
        { id: 'courses', label: 'Courses' }, // Redirects to Home -> Courses
        { id: 'about-course', label: 'About Course' }, // Local Scroll
        { id: 'faculty', label: 'Faculty' }, // Local Scroll
        { id: 'testimonials', label: 'Testimonials' }, // Local Scroll
        { id: 'contact', label: 'Register' }, // Redirects to Home -> Register
    ];

    const navItems = isCourseDetailPage ? courseDetailNavItems : defaultNavItems;

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="header-content">
                    {/* Logo - Text Only */}
                    <div className="logo" onClick={() => handleNavClick('home')}>
                        <div className="logo-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={rctiHeaderLogo} alt="RCTI Logo" style={{ height: '40px', width: 'auto' }} />
                            <span className="logo-title">Rane's Computer & Typing Institute</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        <ul className="nav-list">
                            {navItems.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(item.id);
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className={`nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list-mobile">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    className={`nav-link-mobile ${activeSection === item.id ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.id);
                                    }}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
