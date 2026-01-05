import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing horizontal slider functionality
 * @param {React.RefObject} sliderRef - Reference to the slider element
 * @param {Array} dependencies - Dependencies array to trigger scroll button check
 * @returns {Object} - { canScrollLeft, canScrollRight, scroll }
 */
export const useSlider = (sliderRef, dependencies = [], options = {}) => {
    const {
        autoPlay = false,
        autoPlayInterval = 5000,
        pauseOnHover = true,
        isPaused = false
    } = options;

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const autoPlayTimerRef = useRef(null);

    const checkScrollButtons = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Allow a small buffer (e.g. 10px) to account for fractional pixel differences
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400; // Base scroll amount
            let newScrollLeft;

            if (direction === 'left') {
                newScrollLeft = sliderRef.current.scrollLeft - scrollAmount;
            } else if (direction === 'right') {
                newScrollLeft = sliderRef.current.scrollLeft + scrollAmount;
            } else if (direction === 'rewind') {
                newScrollLeft = 0;
            }

            sliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            // Reset timer on manual or auto scroll
            resetAutoPlayTimer();
            // Check buttons after scroll animation
            setTimeout(checkScrollButtons, 500);
        }
    };

    const startAutoPlay = () => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);

        autoPlayTimerRef.current = setInterval(() => {
            if (isPaused || (pauseOnHover && isHovering)) return;

            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
                const maxScroll = scrollWidth - clientWidth;

                // If close to the end, rewind
                if (scrollLeft >= maxScroll - 10) {
                    scroll('rewind');
                } else {
                    scroll('right');
                }
            }
        }, autoPlayInterval);
    };

    const resetAutoPlayTimer = () => {
        if (!autoPlay) return;
        startAutoPlay();
    };

    // Initial setup and event listeners
    useEffect(() => {
        checkScrollButtons();
        const slider = sliderRef.current;

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        if (slider) {
            slider.addEventListener('scroll', checkScrollButtons);

            if (pauseOnHover) {
                slider.addEventListener('mouseenter', handleMouseEnter);
                slider.addEventListener('mouseleave', handleMouseLeave);
            }
        }

        return () => {
            if (slider) {
                slider.removeEventListener('scroll', checkScrollButtons);
                slider.removeEventListener('mouseenter', handleMouseEnter);
                slider.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [dependencies, pauseOnHover]);

    // Manage Auto Play
    useEffect(() => {
        if (autoPlay) {
            startAutoPlay();
        }
        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        };
    }, [autoPlay, autoPlayInterval, isPaused, isHovering]); // Re-create timer if these change

    return { canScrollLeft, canScrollRight, scroll };
};
