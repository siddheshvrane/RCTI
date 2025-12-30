import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { MdLibraryBooks, MdPeople, MdReviews, MdLogout, MdImage, MdListAlt } from 'react-icons/md';
import '../Admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        }
    }, [navigate]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.admin-sidebar') && !event.target.closest('.admin-mobile-menu-btn')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const navItems = [
        { path: '/admin/dashboard/courses', label: 'Courses', icon: <MdLibraryBooks /> },
        { path: '/admin/dashboard/faculty', label: 'Faculty', icon: <MdPeople /> },
        { path: '/admin/dashboard/testimonials', label: 'Testimonials', icon: <MdReviews /> },
        { path: '/admin/dashboard/banners', label: 'Banners', icon: <MdImage /> },
        { path: '/admin/dashboard/registrations', label: 'Registrations', icon: <MdListAlt /> },
    ];

    return (
        <div className="admin-layout">
            {/* Mobile Menu Button */}
            <button
                className={`admin-mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Overlay */}
            <div
                className={`admin-sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2 className="admin-sidebar-title">Admin Panel</h2>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname.includes(item.path) ? 'active' : ''}`}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className="logout-btn">
                    <MdLogout style={{ marginRight: '10px' }} />
                    Logout
                </button>
            </div>

            {/* Content Area */}
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
