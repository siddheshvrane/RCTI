import { useEffect, useRef, useState } from 'react';
import { useTypingAnimation } from '../utils/typingAnimation';
import { mockApi } from '../services/mockApi';
import { useSlider } from '../hooks/useSlider';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import SliderNavButton from './common/SliderNavButton';
import { Icons } from '../constants/icons';
import './Faculty.css';

const Faculty = ({ courseName }) => {
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const data = await mockApi.getFaculty();
                setFaculty(data);
            } catch (error) {
                console.error('Failed to fetch faculty:', error);
            }
        };
        fetchFaculty();

        // Trigger typing animation on scroll
        const cleanup = useTypingAnimation(sectionRef);
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    const filteredFaculty = courseName
        ? faculty.filter(member => member.courses && member.courses.some(c => c.title === courseName))
        : faculty;

    // Sort by experience (high to low)
    const sortedFaculty = [...filteredFaculty].sort((a, b) => {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA; // Descending
    });

    const displayFaculty = sortedFaculty;

    // Use custom hooks
    const { canScrollLeft, canScrollRight, scroll } = useSlider(sliderRef, [displayFaculty], { autoPlay: true });
    useIntersectionObserver(sectionRef, 'faculty');

    if (courseName && displayFaculty.length === 0) {
        return null;
    }

    return (
        <section id="faculty" className="section faculty" ref={sectionRef}>
            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title typing-effect">{courseName ? `Faculty for ${courseName}` : 'Our Expert Faculty'}</h2>
                    <p className="section-subtitle">
                        Learn from experienced professionals dedicated to your success
                    </p>
                </div>

                <div className="faculty-slider-wrapper">
                    <SliderNavButton
                        direction="left"
                        onClick={() => scroll('left')}
                        visible={canScrollLeft}
                    />

                    <div className="faculty-slider" ref={sliderRef}>
                        {displayFaculty.map((member) => (
                            <div key={member._id} className="faculty-card">
                                <div className="faculty-avatar">
                                    {member.imageUrl ? (
                                        <img src={member.imageUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : (
                                        member.avatar || member.name.split(' ').map(n => n[0]).join('')
                                    )}
                                </div>

                                <div className="faculty-info">
                                    <h3 className="faculty-name">{member.name}</h3>
                                    <p className="faculty-designation">{member.position}</p>

                                    <div className="faculty-detail">
                                        <div className="detail-icon">
                                            <Icons.Education />
                                        </div>
                                        <span>{member.qualification}</span>
                                    </div>

                                    <div className="faculty-detail">
                                        <div className="detail-icon">
                                            <Icons.Experience />
                                        </div>
                                        <span>{member.experience} Years Experience</span>
                                    </div>

                                    <div className="courses-taught">
                                        <h4>Courses:</h4>
                                        <div className="course-tags">
                                            {member.courses?.map((course, idx) => (
                                                <span key={idx} className="course-tag">{course.title}</span>
                                            ))}
                                        </div>
                                    </div>
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

export default Faculty;
