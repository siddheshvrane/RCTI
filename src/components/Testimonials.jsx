import { useEffect, useRef, useState } from 'react';
import { useTypingAnimation } from '../utils/typingAnimation';
import { mockApi } from '../services/mockApi';
import { useSlider } from '../hooks/useSlider';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import SliderNavButton from './common/SliderNavButton';
import StarRating from './common/StarRating';
import './Testimonials.css';

const Testimonials = ({ courseName }) => {
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await mockApi.getTestimonials();
                setTestimonials(data);
            } catch (error) {
                console.error('Failed to fetch testimonials:', error);
            }
        };
        fetchTestimonials();

        // Trigger typing animation on scroll
        const cleanup = useTypingAnimation(sectionRef);
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    const filteredTestimonials = courseName
        ? testimonials.filter(t => t.courses && t.courses.some(course => course === courseName || (typeof course === 'object' && course.title === courseName)))
        : testimonials;

    const displayTestimonials = filteredTestimonials;

    if (courseName && displayTestimonials.length === 0) {
        return null;
    }

    // Use custom hooks
    const { canScrollLeft, canScrollRight, scroll } = useSlider(sliderRef, [displayTestimonials]);
    useIntersectionObserver(sectionRef, 'testimonials');

    return (
        <section id="testimonials" className="section testimonials" ref={sectionRef}>
            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title typing-effect">Student Testimonials</h2>
                    <p className="section-subtitle">
                        Hear what our successful students have to say about their learning experience
                    </p>
                </div>

                <div className="testimonials-slider-wrapper">
                    <SliderNavButton
                        direction="left"
                        onClick={() => scroll('left')}
                        visible={canScrollLeft}
                    />

                    <div className="testimonials-slider" ref={sliderRef}>
                        {displayTestimonials.map((testimonial) => (
                            <div key={testimonial._id} className="testimonial-card">
                                <div className="testimonial-header">
                                    <div className="student-avatar">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="student-info">
                                        <h4 className="student-name">{testimonial.name}</h4>
                                        <div className="student-course-tag">{testimonial.courses?.join(', ')}</div>
                                    </div>
                                </div>

                                <StarRating rating={testimonial.rating} />

                                <div className="review-text">
                                    <p>"{testimonial.review}"</p>
                                </div>

                                <div className="result-section">
                                    <div className="result-label">Achievement</div>
                                    <div className="result-text">{testimonial.result}</div>
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

export default Testimonials;
