import { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import './PhotoSlider.css';

const PhotoSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch banners from database
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await mockApi.getBanners();
                setBanners(data);
            } catch (error) {
                console.error('Error fetching banners:', error);
                // Fallback to default slides if API fails
                setBanners([
                    { id: 1, imageUrl: '', order: 0 },
                    { id: 2, imageUrl: '', order: 1 },
                    { id: 3, imageUrl: '', order: 2 },
                    { id: 4, imageUrl: '', order: 3 }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (isLoading) {
        return (
            <section id="home" className="photo-slider">
                <div className="slider-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--color-gray-500)' }}>Loading...</p>
                </div>
            </section>
        );
    }

    // If no banners, show default gradient slides
    if (banners.length === 0) {
        return (
            <section id="home" className="photo-slider">
                <div className="slider-container">
                    <div className="slide active slide-1">
                        <div className="slide-overlay"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home" className="photo-slider">
            <div className="slider-container">
                {banners.map((banner, index) => (
                    <div
                        key={banner._id || banner.id}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: banner.imageUrl ? `url(${banner.imageUrl})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {!banner.imageUrl && <div className={`slide-${index + 1}`} style={{ width: '100%', height: '100%' }}></div>}
                        <div className="slide-overlay"></div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button className="slider-btn prev-btn" onClick={prevSlide} aria-label="Previous slide">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button className="slider-btn next-btn" onClick={nextSlide} aria-label="Next slide">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        {/* Dots Navigation */}
                        <div className="slider-dots">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default PhotoSlider;
