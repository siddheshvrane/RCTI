import { useState, useEffect, useRef } from 'react';
import { mockApi } from '../services/mockApi';
import { useTypingAnimation } from '../utils/typingAnimation';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSlider } from '../hooks/useSlider';
import SliderNavButton from './common/SliderNavButton';
import './LifeAtRCTI.css';

const LifeAtRCTI = () => {
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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

    // Lightbox handlers
    const openLightbox = (index) => {
        setSelectedImageIndex(index);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeLightbox = () => {
        setSelectedImageIndex(null);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev + 1) % photos.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const { canScrollLeft, canScrollRight, scroll } = useSlider(sliderRef, [photos]);

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
                    <h2 className="section-title typing-effect">Gallery</h2>
                    <p className="section-subtitle">Glimpses of our institute, events, and classroom activities</p>
                </div>

                <div className="gallery-slider-wrapper">
                    <SliderNavButton
                        direction="left"
                        onClick={() => scroll('left')}
                        visible={canScrollLeft}
                    />

                    <div className="gallery-slider" ref={sliderRef}>
                        {photos.map((photo, index) => (
                            <div
                                key={photo._id}
                                className="gallery-item"
                                onClick={() => openLightbox(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={photo.imageUrl}
                                    alt={`Gallery - ${index + 1}`}
                                    loading="lazy"
                                />
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

            {/* Lightbox Modal */}
            {selectedImageIndex !== null && (
                <div className="gallery-modal-overlay" onClick={closeLightbox}>
                    <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeLightbox} aria-label="Close gallery">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <button className="modal-nav-btn prev" onClick={prevImage} aria-label="Previous image">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>

                        <img
                            src={photos[selectedImageIndex].imageUrl}
                            alt={`Gallery Fullscreen - ${selectedImageIndex + 1}`}
                            className="modal-image"
                        />

                        <button className="modal-nav-btn next" onClick={nextImage} aria-label="Next image">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <div className="modal-counter">
                            {selectedImageIndex + 1} / {photos.length}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LifeAtRCTI;
