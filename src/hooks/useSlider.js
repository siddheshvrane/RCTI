import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing horizontal slider functionality
 * @param {React.RefObject} sliderRef - Reference to the slider element
 * @param {Array} dependencies - Dependencies array to trigger scroll button check
 * @param {Object} options - Options for autoplay and behavior
 * @returns {Object} - { canScrollLeft, canScrollRight, scroll }
 */
export const useSlider = (sliderRef, dependencies = [], options = {}) => {
    const {
        autoPlay = false,
        autoPlayInterval = 3000, // Changed to 3 seconds
        pauseOnHover = true,
        isPaused = false,
        threshold = 0.6
    } = options;

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Refs for state to be used inside interval without closure stalwartness
    const autoPlayTimerRef = useRef(null);
    const hasViewedRef = useRef(false);
    const isHoveringRef = useRef(isHovering);
    const isVisibleRef = useRef(isVisible);
    const isPausedRef = useRef(isPaused);
    const autoPlayRef = useRef(autoPlay);

    // Update refs when state changes
    useEffect(() => {
        isHoveringRef.current = isHovering;
    }, [isHovering]);

    useEffect(() => {
        isVisibleRef.current = isVisible;
    }, [isVisible]);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        autoPlayRef.current = autoPlay;
    }, [autoPlay]);

    const checkScrollButtons = useCallback(() => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Allow a small buffer (e.g. 10px) to account for fractional pixel differences
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    }, [sliderRef]);

    const scroll = useCallback((direction) => {
        if (sliderRef.current) {
            // Dynamic scroll amount calculation
            let scrollAmount = 400; // Fallback
            const firstCard = sliderRef.current.firstElementChild;

            if (firstCard) {
                const cardStyle = window.getComputedStyle(firstCard);
                const cardWidth = firstCard.offsetWidth;
                const marginRight = parseFloat(cardStyle.marginRight) || 0;
                const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
                // We assume flex gap or margin is used. 
                // If using flex gap, it's harder to get from just the element. 
                // But typically slider items have a width + gap. 
                // Let's check if the parent has a gap.
                const parentStyle = window.getComputedStyle(sliderRef.current);
                const gap = parseFloat(parentStyle.gap) || 0;

                scrollAmount = cardWidth + Math.max(marginRight + marginLeft, gap);
            }

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
    }, [sliderRef, checkScrollButtons]);

    const startAutoPlay = useCallback(() => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);

        autoPlayTimerRef.current = setInterval(() => {
            // STRICT CHECK using Refs to ensure fresh values
            const shouldPause =
                isPausedRef.current ||
                (pauseOnHover && isHoveringRef.current) ||
                !isVisibleRef.current ||
                !autoPlayRef.current;

            if (shouldPause) return;

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
    }, [autoPlayInterval, pauseOnHover, scroll]);

    const resetAutoPlayTimer = useCallback(() => {
        if (!autoPlayRef.current || !isVisibleRef.current) return;
        startAutoPlay();
    }, [startAutoPlay]);

    // 1. Visibility Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: threshold }
        );

        if (sliderRef.current) {
            observer.observe(sliderRef.current);
        }

        return () => {
            if (sliderRef.current) {
                observer.unobserve(sliderRef.current);
            }
        };
    }, [threshold, ...dependencies]); // Re-create observer if threshold changes or dependencies update

    // 2. Reset on First View Logic
    useEffect(() => {
        if (isVisible && !hasViewedRef.current) {
            hasViewedRef.current = true;
            // Force reset to start when first becoming visible
            if (sliderRef.current) {
                sliderRef.current.scrollTo({ left: 0, behavior: 'auto' });
                checkScrollButtons();
            }
        }
    }, [isVisible, checkScrollButtons]);

    // 3. Event Listeners for Hover/Scroll
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
    }, [dependencies, pauseOnHover, checkScrollButtons]);

    // 4. Manage Auto Play Lifecycle
    useEffect(() => {
        if (autoPlay && isVisible) {
            startAutoPlay();
        } else {
            // Stop immediately if not visible or autoPlay disabled
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        }

        return () => {
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        };
    }, [autoPlay, isVisible, startAutoPlay]); // Simplified deps since startAutoPlay handles the logic

    return { canScrollLeft, canScrollRight, scroll };
};
