import { useState, useEffect } from 'react';

/**
 * Custom hook for managing horizontal slider functionality
 * @param {React.RefObject} sliderRef - Reference to the slider element
 * @param {Array} dependencies - Dependencies array to trigger scroll button check
 * @returns {Object} - { canScrollLeft, canScrollRight, scroll }
 */
export const useSlider = (sliderRef, dependencies = []) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = direction === 'left'
                ? sliderRef.current.scrollLeft - scrollAmount
                : sliderRef.current.scrollLeft + scrollAmount;

            sliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            setTimeout(checkScrollButtons, 300);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('scroll', checkScrollButtons);
            return () => slider.removeEventListener('scroll', checkScrollButtons);
        }
    }, dependencies);

    return { canScrollLeft, canScrollRight, scroll };
};
