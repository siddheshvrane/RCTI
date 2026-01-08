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
            // If already active, don't restart. 
            // However, we must ensure we don't have a zombie loop.
            // If typingActive is true, we assume the current loop is valid.
            if (el.dataset.typingActive === 'true') return;

            // Store original text if not already stored
            if (!el.dataset.fullText) {
                el.dataset.fullText = el.textContent.trim();
            }

            const fullText = el.dataset.fullText;
            el.textContent = ''; // Clear text to start typing
            el.dataset.typingActive = 'true';
            el.classList.add('typing-active');

            // generate a unique ID for this specific animation session
            const sessionId = Date.now() + Math.random().toString();
            el.dataset.typingSession = sessionId;

            let charIndex = 0;
            const typeChar = () => {
                // Check if this session is still the active one
                if (el.dataset.typingSession !== sessionId) return;

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
            // Invalidate the session so any running loop stops
            el.dataset.typingSession = '';

            if (el.dataset.fullText) {
                // Reset to empty so it's clean for next time
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
