import { useState, useEffect, useRef } from 'react';
import { mockApi } from '../services/mockApi';
import { useTypingAnimation } from '../utils/typingAnimation';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import './LifeAtRCTI.css';

const LifeAtRCTI = () => {
    const sectionRef = useRef(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useIntersectionObserver(sectionRef, 'life-at-rcti', { threshold: 0.3 }, [loading]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await mockApi.getInstitutePhotos();
                setPhotos(data);
            } catch (error) {
                console.error('Error fetching institute photos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    useEffect(() => {
        if (!loading && photos.length > 0) {
            // Trigger typing animation only after content is rendered
            const cleanup = useTypingAnimation(sectionRef);
            return () => {
                if (cleanup) cleanup();
            };
        }
    }, [loading, photos.length]);

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (photos.length === 0) {
        return null; // Don't show section if no photos
    }

    return (
        <section className="life-at-rcti-section" id="life-at-rcti" ref={sectionRef}>
            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title typing-effect">Life at RCTI</h2>
                    <p className="section-subtitle">Glimpses of our institute, events, and classroom activities</p>
                </div>

                <div className="photo-grid">
                    {photos.map((photo, index) => (
                        <div key={photo._id} className="photo-item">
                            <img
                                src={photo.imageUrl}
                                alt={`Life at RCTI - ${index + 1}`}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LifeAtRCTI;
