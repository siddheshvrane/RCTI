import eventBus from '../services/eventBus';
import mkclLogo from '../assets/mkcl logo.png';
import './Footer.css';

const Footer = () => {
    const handleNavClick = (section) => {
        eventBus.emitNavigation({ section });
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    };

    const address = "Shop no 7, Lingeshwar Apartment, near Saraswat Bank, Bhatwadi, Kaju Pada, Ghatkopar West, Mumbai 400084";
    const googleMapsUrl = "https://www.google.com/maps?q=RANE'S COMPUTER INSTITUTE Shop no 7, near Saraswat Bank, Bhatwadi, Kaju Pada, Ghatkopar West, Mumbai, Maharashtra 400084";

    return (
        <footer className="footer">
            <div className="footer-background"></div>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-left">
                        <h3 className="footer-institute-name">Rane's Computer and Typing Institute</h3>

                        <div className="footer-info">
                            <div className="footer-item">
                                <div className="footer-label">
                                    <a
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="location-link"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        Address
                                    </a>
                                </div>
                                <div className="footer-text">{address}</div>
                            </div>

                            <div className="footer-item">
                                <div className="footer-label">Phone</div>
                                <div className="footer-text">
                                    <a href="tel:+919869855785">+91 98698 55785</a><br />
                                    <a href="tel:+918355810613">+91 83558 10613</a>
                                </div>
                            </div>

                            <div className="footer-item">
                                <div className="footer-label">Email</div>
                                <div className="footer-text">
                                    <a href="mailto:ranescomputer@gmail.com">ranescomputer@gmail.com</a>
                                </div>
                            </div>
                        </div>

                        <div className="footer-links">
                            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a>
                            <span className="separator">•</span>
                            <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
                            <span className="separator">•</span>
                            <a href="#courses" onClick={(e) => { e.preventDefault(); handleNavClick('courses'); }}>Courses</a>
                            <span className="separator">•</span>
                            <a href="#faculty" onClick={(e) => { e.preventDefault(); handleNavClick('faculty'); }}>Faculty</a>
                            <span className="separator">•</span>
                            <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleNavClick('testimonials'); }}>Testimonials</a>
                            <span className="separator">•</span>
                            <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
                        </div>
                    </div>

                    <div className="footer-right">
                        <div className="footer-logo">
                            <div className="footer-logo-text">RCTI</div>
                            <div className="footer-logo-subtitle">Excellence in Education</div>
                        </div>

                        <div className="social-media">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <a
                                    href="https://www.facebook.com/share/1NAruT9GD5/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon facebook"
                                    aria-label="Facebook"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://www.instagram.com/ranescomputer?igsh=MXByMDM3c3pmNnR3NQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon instagram"
                                    aria-label="Instagram"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://wa.me/918355810613"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon whatsapp"
                                    aria-label="WhatsApp"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="mkcl-section">
                            <div className="mkcl-logo-container">
                                <img src={mkclLogo} alt="MKCL Logo" className="mkcl-logo" />
                            </div>
                            <p className="mkcl-text">MKCL Authorized Centre</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Rane's Computer and Typing Institute. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
