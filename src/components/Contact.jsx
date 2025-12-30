import { useEffect, useRef, useState } from 'react';
import eventBus from '../services/eventBus';
import { mockApi } from '../services/mockApi';
import { useTypingAnimation } from '../utils/typingAnimation';
import './Contact.css';

const Contact = () => {
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        message: ''
    });
    const [courses, setCourses] = useState([]);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        // Fetch courses for dropdown
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses');
                if (response.ok) {
                    const data = await response.json();
                    // API returns an array directly
                    if (Array.isArray(data)) {
                        setCourses(data);
                    } else if (data.success && data.data) {
                        setCourses(data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        eventBus.emitActiveSection({ section: 'contact' });
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const courseInquirySubscription = eventBus.onCourseInquiry().subscribe((data) => {
            setFormData(prev => ({ ...prev, course: data.course }));
        });

        // Trigger typing animation on scroll
        const cleanup = useTypingAnimation(sectionRef);

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
            courseInquirySubscription.unsubscribe();
            if (cleanup) cleanup();
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('sending');
        setErrorMessage('');

        try {
            const response = await fetch('/api/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                eventBus.emitFormSubmit(formData);
                setSubmitStatus('success');
                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        course: '',
                        message: ''
                    });
                    setSubmitStatus(null);
                }, 3000);
            } else {
                setSubmitStatus('error');
                setErrorMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            setErrorMessage('Failed to connect to server. Please try again later.');
        }
    };

    return (
        <section id="contact" className="section contact" ref={sectionRef}>
            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title typing-effect">Register Now</h2>
                    <p className="section-subtitle">
                        Take the first step towards your success. Register for our courses today
                    </p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                        <h3 className="typing-effect">Get In Touch</h3>
                        <p>
                            Have questions about our courses? Want to enroll? Feel free to reach out to us.
                            We're here to help you start your learning journey!
                        </p>

                        <div className="info-items">
                            <div className="info-item">
                                <div className="info-label">Address</div>
                                <div className="info-value">
                                    Shop no 7, Lingeshwar Apartment, near Saraswat Bank, Bhatwadi,<br />
                                    Kaju Pada, Ghatkopar West, Mumbai 400084
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">Phone</div>
                                <div className="info-value">
                                    +91 9869855785
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">Email</div>
                                <div className="info-value">
                                    ranescomputer@gmail.com
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">Working Hours</div>
                                <div className="info-value">
                                    Monday - Saturday: 8:00 AM - 10:00 PM<br />
                                    Sunday: 09:00 AM - 12:00 PM
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <h3>Registration Form</h3>

                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="course">Interested Course</label>
                                <select
                                    id="course"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a course</option>
                                    {courses.length > 0 ? (
                                        courses.map((course) => (
                                            <option key={course._id} value={course.title}>
                                                {course.title}
                                            </option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="Basic Computer Course">Basic Computer Course</option>
                                            <option value="Advanced MS Office">Advanced MS Office</option>
                                            <option value="English Typing">English Typing</option>
                                            <option value="Marathi Typing">Marathi Typing</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Tally with GST">Tally with GST</option>
                                            <option value="Graphic Design">Graphic Design</option>
                                            <option value="Programming">Programming (C, C++, Java)</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tell us about your requirements..."
                                ></textarea>
                            </div>

                            {submitStatus === 'success' && (
                                <div className="success-message">
                                    ✓ Thank you! We'll get back to you soon.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                                    ⚠ {errorMessage}
                                </div>
                            )}

                            <button type="submit" className="btn-submit">
                                Submit Registration
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
