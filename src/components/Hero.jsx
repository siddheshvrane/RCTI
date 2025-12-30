import { useEffect } from 'react';
import eventBus from '../services/eventBus';
import './Hero.css';

const Hero = () => {
    useEffect(() => {
        // Emit that hero section is loaded
        eventBus.emitActiveSection({ section: 'home' });
    }, []);

    const handleCTAClick = (action) => {
        // Emit CTA click event via RxJS
        eventBus.emit('cta-click', { action });

        if (action === 'enroll') {
            eventBus.emitNavigation({ section: 'contact' });
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'courses') {
            eventBus.emitNavigation({ section: 'courses' });
            document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="hero">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="hero-pattern"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <div className="hero-text fade-in-up">
                        <h1 className="hero-title">
                            Master Computer Skills &<br />
                            <span className="gradient-text">Perfect Your Typing</span>
                        </h1>
                        <p className="hero-description">
                            Join Rane's Computer and Typing Institute - Your gateway to digital excellence.
                            Learn from certified professionals and unlock your potential with industry-recognized courses.
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">Years Experience</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">5000+</div>
                                <div className="stat-label">Students Trained</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">20+</div>
                                <div className="stat-label">Courses Offered</div>
                            </div>
                        </div>
                        <div className="hero-cta">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => handleCTAClick('enroll')}
                            >
                                Enroll Now
                            </button>
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={() => handleCTAClick('courses')}
                            >
                                View Courses
                            </button>
                        </div>
                    </div>

                    <div className="hero-image fade-in">
                        <div className="image-container">
                            <div className="floating-card card-1">
                                <span className="icon">⌨️</span>
                                <span className="text">Typing Mastery</span>
                            </div>
                            <div className="floating-card card-2">
                                <span className="icon">💼</span>
                                <span className="text">Job Ready</span>
                            </div>
                            <div className="floating-card card-3">
                                <span className="icon">🎓</span>
                                <span className="text">Certified Courses</span>
                            </div>
                            <div className="hero-illustration">
                                <div className="illustration-circle"></div>
                                <div className="illustration-content">
                                    <span className="illustration-icon">💻</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-wave">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="var(--color-gray-50)" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
