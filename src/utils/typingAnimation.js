// Utility to trigger typing animation on scroll
export const useTypingAnimation = (elementRef) => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                const typingElements = el.querySelectorAll ? el.querySelectorAll('.typing-effect') : [];

                if (typingElements.length === 0 && el.classList.contains('typing-effect')) {
                    handleTyping(el, entry.isIntersecting);
                } else {
                    typingElements.forEach(typingEl => handleTyping(typingEl, entry.isIntersecting));
                }
            });
        },
        { threshold: 0.2 }
    );

    const handleTyping = (el, isVisible) => {
        if (isVisible) {
            if (el.dataset.typingActive === 'true') return;

            // Store original text if not already stored
            if (!el.dataset.fullText) {
                el.dataset.fullText = el.textContent.trim();
            }

            const fullText = el.dataset.fullText;
            el.textContent = ''; // Clear text to start typing
            el.dataset.typingActive = 'true';
            el.classList.add('typing-active');

            let charIndex = 0;
            const typeChar = () => {
                if (!el.dataset.typingActive) return; // Stop if no longer active

                if (charIndex < fullText.length) {
                    el.textContent += fullText.charAt(charIndex);
                    charIndex++;
                    // Randomize typing speed slightly for realism
                    const delay = 30 + Math.random() * 50;
                    setTimeout(typeChar, delay);
                } else {
                    // Typing finished
                    el.dataset.typingDone = 'true';
                }
            };

            typeChar();

        } else {
            // Reset when out of view
            el.dataset.typingActive = 'false';
            el.classList.remove('typing-active');
            if (el.dataset.fullText) {
                // Restore text or clear it? 
                // To repeat animation on next scroll, we should probably leave it clear or reset to empty.
                // But for SEO and fallback, keeping full text is better. 
                // However, the logic above clears it on 'isVisible' entry.
                // So here we can just reset state.
                el.textContent = '';
            }
        }
    };

    observer.observe(elementRef.current);

    return () => {
        if (elementRef.current) {
            observer.unobserve(elementRef.current);
        }
    };
};
