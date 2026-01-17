import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingAnimation } from '../utils/typingAnimation';
import { mockApi } from '../services/mockApi';
import { useSlider } from '../hooks/useSlider';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import SliderNavButton from './common/SliderNavButton';
import { Icons } from '../constants/icons';
import './Courses.css';

const Courses = () => {
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [courses, setCourses] = useState([]);

    const filteredCourses = selectedCategory === 'all'
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    // Use custom hooks
    const { canScrollLeft, canScrollRight, scroll } = useSlider(sliderRef, [filteredCourses], { autoPlay: true });
    useIntersectionObserver(sectionRef, 'courses', { threshold: 0.1 }, [filteredCourses.length]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch only summary data for the list
                const data = await mockApi.getCourses('summary');
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        };
        fetchCourses();

        // Trigger typing animation on scroll
        const cleanup = useTypingAnimation(sectionRef);
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    const navigate = useNavigate();

    const handleKnowMore = (course) => {
        const slug = course.title.toLowerCase().replace(/\s+/g, '-');
        navigate(`/courses/${slug}`);
    };

    const categories = [
        { id: 'all', label: 'All Courses' },
        { id: 'computer', label: 'Computer Courses' },
        { id: 'typing', label: 'Typing Courses' }
    ];

    return (
        <section id="courses" className="section courses" ref={sectionRef} style={{ minHeight: '600px' }}>
            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title typing-effect">Our Courses</h2>
                    <p className="section-subtitle">
                        Choose from our wide range of professional courses designed for your success
                    </p>
                </div>

                <div className="course-filters">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                <div className="courses-slider-wrapper">
                    <SliderNavButton
                        direction="left"
                        onClick={() => scroll('left')}
                        visible={canScrollLeft}
                    />

                    <div className="courses-slider" ref={sliderRef}>
                        {filteredCourses.map((course) => (
                            <div key={course._id} className="course-card">
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

                                <p className="course-description">{course.description}</p>

                                <div className="course-footer">
                                    <div className="course-fees">₹ {course.fees}</div>
                                    <button
                                        className="btn-know-more"
                                        onClick={() => handleKnowMore(course)}
                                    >
                                        Know More →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <SliderNavButton
                        direction="right"
                        onClick={() => scroll('right')}
                        visible={canScrollRight}
                    />
                </div>
            </div>
        </section>
    );
};

export default Courses;
