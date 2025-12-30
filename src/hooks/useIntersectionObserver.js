import { useEffect } from 'react';
import eventBus from '../services/eventBus';

/**
 * Custom hook for managing IntersectionObserver with event emission
 * @param {React.RefObject} ref - Reference to the element to observe
 * @param {string} sectionName - Name of the section for event emission
 * @param {Object} options - IntersectionObserver options (threshold, etc.)
 */
export const useIntersectionObserver = (ref, sectionName, options = { threshold: 0.3 }) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        eventBus.emitActiveSection({ section: sectionName });
                    }
                });
            },
            options
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, sectionName, options.threshold]);
};
