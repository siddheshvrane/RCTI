import { useEffect, useRef } from 'react';
import eventBus from '../services/eventBus';
import './Features.css';

const Features = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        eventBus.emitActiveSection({ section: 'features' });
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const features = [
        {
            id: 1,
            icon: '👨‍🏫',
            title: 'Expert Instructors',
            description: 'Learn from certified professionals with years of industry experience and teaching expertise.'
        },
        {
            id: 2,
            icon: '💼',
            title: 'Placement Assistance',
            description: 'Get career guidance and job placement support to kickstart your professional journey.'
        },
        {
            id: 3,
            icon: '🏆',
            title: 'Certified Courses',
            description: 'Earn industry-recognized certificates that add value to your resume and career.'
        },
        {
            id: 3,
            icon: '⏰',
            title: 'Flexible Timings',
            description: 'Choose from morning, afternoon, or evening batches that fit your schedule perfectly.'
        },
        {
            id: 4,
            icon: "🖥️",
            title: "100% Practical Training",
            description: "One student, one computer policy. Maximum hands-on practice."
        },
        {
            id: 5,
            icon: "📚",
            title: "Study Material & ERA",
            description: "Official books and ERA Login for MSCIT students for interactive learning."
        },
        {
            id: 6,
            icon: "👆",
            title: "Biometric Attendance",
            description: "Digital attendance tracking to ensure discipline and punctuality."
        },
        {
            id: 7,
            icon: "📜",
            title: "Govt. Recognized",
            description: "Authorized MKCL center for valid and valuable certifications."
        },
        {
            id: 8,
            icon: "👨‍🏫",
            title: "Personal Attention",
            description: "Small batches with dedicated guidance for every student."
        },
        {
            id: 9,
            icon: "💼",
            title: "Job Assistance",
            description: "Resume building and placement support for career courses."
        }
    ];

    return (
        <section id="features" className="section features" ref={sectionRef}>
            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title">Why Choose Us</h2>
                    <p className="section-subtitle">
                        Discover what makes us the preferred choice for computer and typing education
                    </p>
                </div>

                <div className="features-grid grid grid-4">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="feature-card card card-glass"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">{feature.icon}</span>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
