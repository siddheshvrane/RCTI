// Utility to trigger typing animation on scroll
export const useTypingAnimation = (elementRef) => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                // We target the .typing-effect elements inside the section/entry
                const typingElements = el.querySelectorAll ? el.querySelectorAll('.typing-effect') : [];

                if (typingElements.length === 0 && el.classList.contains('typing-effect')) {
                    // Handle case where element itself is the target
                    handleTyping(el, entry.isIntersecting);
                } else {
                    typingElements.forEach(typingEl => handleTyping(typingEl, entry.isIntersecting));
                }
            });
        },
        { threshold: 0.2 } // Lower threshold for earlier trigger
    );

    const handleTyping = (el, isVisible) => {
        if (isVisible) {
            // Calculate width only if not already done to avoid layout thrashing
            if (!el.style.getPropertyValue('--type-width')) {
                const textLength = el.textContent.length;
                const width = el.scrollWidth + 20;
                el.style.setProperty('--type-width', `${width}px`);
                el.style.setProperty('--type-steps', textLength);
            }
            el.classList.add('typing-active');
        } else {
            el.classList.remove('typing-active');
        }
    };

    observer.observe(elementRef.current);

    return () => {
        if (elementRef.current) {
            observer.unobserve(elementRef.current);
        }
    };
};
