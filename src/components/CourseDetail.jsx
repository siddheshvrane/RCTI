import { useParams, Navigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import Faculty from './Faculty';
import Testimonials from './Testimonials';
import './Courses.css'; // Reusing courses css for card styles
import eventBus from '../services/eventBus';
import { useEffect, useState, useRef } from 'react';
import { Icons } from '../constants/icons';
import { FiTarget, FiAward, FiCheckCircle, FiBookOpen, FiClock, FiActivity, FiDollarSign } from 'react-icons/fi';
import SEO from './common/SEO';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const aboutSectionRef = useRef(null);

    useIntersectionObserver(aboutSectionRef, 'about-course');

    useEffect(() => {
        window.scrollTo(0, 0);
        eventBus.emitActiveSection({ section: 'about-course' });

        const fetchCourse = async () => {
            try {
                const courses = await mockApi.getCourses();
                const foundCourse = courses.find(c => String(c._id) === id || c.title.toLowerCase().replace(/\s+/g, '-') === id);
                setCourse(foundCourse);
            } catch (error) {
                console.error('Failed to fetch course details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-xl text-gray-500">Loading course details...</div>
            </div>
        );
    }

    if (!course) {
        return <Navigate to="/" replace />;
    }

    const courseSchema = course ? {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "Rane's Computer & Typing Institute",
            "sameAs": "https://rcti.com"
        },
        "offers": {
            "@type": "Offer",
            "price": course.fees,
            "priceCurrency": "INR",
            "category": "Educational"
        }
    } : null;

    return (
        <div className="course-detail-page" style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <SEO
                title={course.title}
                description={course.introduction || course.description}
                url={`/courses/${id}`}
                keywords={`${course.title}, computer course, learn ${course.title}, ${course.level} course`}
                schema={courseSchema}
            />
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', display: 'flex', gap: '40px', alignItems: 'flex-start', flexDirection: 'row' }}>

                {/* Left Side: Sticky Course Card (Exact Replica) */}
                <div className="course-card-sidebar" style={{ width: '350px', flexShrink: 0, position: 'sticky', top: '100px' }}>
                    <div className="course-card" style={{ width: '100%', margin: 0, height: 'auto' }}>
                        <div className="course-header" style={course.bannerUrl ? { backgroundImage: `url(${course.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                            {!course.bannerUrl && <div className="course-number">{String(course._id).slice(-2)}</div>}
                        </div>

                        <h3 className="course-title">{course.title}</h3>

                        <div className="course-badges">
                            <span className="badge duration-badge">
                                <Icons.Clock />
                                {course.duration} Months
                            </span>
                            <span className={`badge level-badge level-${course.level.toLowerCase()}`}>
                                {course.level}
                            </span>
                        </div>

                        <p className="course-description" style={{ WebkitLineClamp: 'none', maxHeight: 'none' }}>{course.description}</p>

                        <div className="course-footer" style={{ marginTop: 'auto' }}>
                            <div className="course-fees">₹ {course.fees}</div>
                            {/* Removed "Know More" button as we are already here */}
                        </div>
                    </div>
                </div>

                {/* Right Side: Scrollable Details */}
                <div className="course-content-main" style={{ flex: 1 }}>
                    {/* Introduction & About */}
                    <div id="about-course" ref={aboutSectionRef} className="detail-card mb-8" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '30px', scrollMarginTop: '100px' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            Introduction
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>{course.introduction}</p>

                        <div style={{ height: '1px', backgroundColor: '#eee', margin: '30px 0' }}></div>

                        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            About This Course
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>{course.about}</p>
                    </div>

                    {/* Objectives & Outcomes */}
                    <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                        <div className="objective-card" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                                <span style={{ display: 'flex' }}><FiTarget size={24} /></span> Objectives
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {course.objectives?.map((item, index) => (
                                    <li key={index} style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <span style={{ color: 'var(--color-primary)', marginTop: '4px' }}><FiCheckCircle size={16} /></span>
                                        <span style={{ flex: 1 }}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="outcome-card" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                                <span style={{ display: 'flex' }}><FiAward size={24} /></span> Outcomes
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {course.outcomes?.map((item, index) => (
                                    <li key={index} style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <span style={{ color: 'var(--color-primary)', marginTop: '4px' }}><FiCheckCircle size={16} /></span>
                                        <span style={{ flex: 1 }}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Modules */}
                    <div className="modules-card" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiBookOpen /> Course Syllabus
                        </h2>
                        <div className="modules-list" style={{ display: 'flex', flexDirection: 'column' }}>
                            {course.modules?.map((mod, index) => (
                                <div key={index} className="module-item" style={{
                                    padding: '15px 0',
                                    borderBottom: index !== course.modules.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '20px'
                                }}>
                                    <span style={{
                                        color: 'var(--color-primary)',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        minWidth: '85px',
                                        flexShrink: 0,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Module {index + 1}
                                    </span>
                                    <span style={{ fontSize: '1rem', color: '#444', lineHeight: '1.6' }}>{mod}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Faculty & Testimonials Sections */}
            <div style={{ backgroundColor: 'white', paddingBottom: '60px' }}>
                <Faculty courseName={course.title} />
                <div style={{ height: '1px', backgroundColor: '#eee', maxWidth: '1200px', margin: '0 auto' }}></div>
                <Testimonials courseName={course.title} />
            </div>

            {/* Mobile Responsive Styles */}
            <style jsx>{`
                @media (max-width: 900px) {
                    .container {
                        flex-direction: column !important;
                    }
                    .course-card-sidebar {
                        width: 100% !important;
                        position: relative !important;
                        top: 0 !important;
                        margin-bottom: 30px;
                    }
                    .course-card {
                        max-width: 400px;
                        margin: 0 auto !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CourseDetail;
