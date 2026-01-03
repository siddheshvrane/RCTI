import { useState, useEffect } from 'react';
import eventBus from '../services/eventBus';
import './Header.css';
import rctiHeaderLogo from '../assets/RCTI_header.jpeg';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

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

    const handleNavClick = (section) => {
        eventBus.emitNavigation({ section });
        setIsMobileMenuOpen(false);

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

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'courses', label: 'Courses' },
        { id: 'faculty', label: 'Faculty' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'contact', label: 'Register' },
    ];

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
