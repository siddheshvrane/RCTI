import eventBus from '../services/eventBus';
import { useTypingAnimation } from '../utils/typingAnimation';
import { mockApi } from '../services/mockApi';
import SEO from './common/SEO';
import './About.css';

const About = () => {
    const sectionRef = useRef(null);
    const foundingYear = 1997;
    const currentYear = new Date().getFullYear();
    const yearsOfExcellence = currentYear - foundingYear;
    const [totalCourses, setTotalCourses] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const courses = await mockApi.getCourses();
                setTotalCourses(courses.length);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        eventBus.emitActiveSection({ section: 'about' });
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const cleanup = useTypingAnimation(sectionRef);

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <section id="about" className="section about" ref={sectionRef}>
            <SEO
                title="About Us"
                description="Learn about Rane's Computer and Typing Institute, our history, experienced faculty, and commitment to quality education since 1997."
                url="/#about"
            />
            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title typing-effect">About Us</h2>
                    <p className="section-subtitle">
                        Empowering students with quality education since {foundingYear}
                    </p>
                </div>

                {/* Main Text Content - Centered */}
                <div className="about-intro">
                    <h3 className="typing-effect">Welcome to Rane's Computer and Typing Institute</h3>
                    <p>
                        At Rane's Computer and Typing Institute, we are committed to providing
                        high-quality computer education and typing training to students of all ages.
                        With over {yearsOfExcellence} years of experience, we have successfully trained thousands of
                        students, helping them achieve their career goals.
                    </p>
                    <p>
                        Our institute offers a comprehensive range of courses designed to meet the
                        demands of today's digital world. From basic computer literacy to advanced
                        programming, from typing skills to web development, we cover it all.
                    </p>
                </div>

                {/* Stats Cards - 4 Columns */}
                <div className="about-stats">
                    <div className="stat-card">
                        <div className="stat-number">{yearsOfExcellence}+</div>
                        <div className="stat-label">Years of Excellence</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">5000+</div>
                        <div className="stat-label">Students Trained</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{totalCourses}+</div>
                        <div className="stat-label">Courses Offered</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">95%</div>
                        <div className="stat-label">Success Rate</div>
                    </div>
                </div>

                {/* Features - 4 Columns */}
                <div className="about-features">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h4>Experienced Faculty</h4>
                        <p>Certified professionals with industry expertise</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </div>
                        <h4>Modern Infrastructure</h4>
                        <p>Latest technology and equipment</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <h4>Flexible Timings</h4>
                        <p>Multiple batches to suit your schedule</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <h4>Certification</h4>
                        <p>Industry-recognized certificates</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
