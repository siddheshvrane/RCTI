import React from 'react';

/**
 * Reusable slider navigation button component
 * @param {string} direction - 'left' or 'right'
 * @param {Function} onClick - Click handler
 * @param {boolean} visible - Whether button should be visible
 * @param {string} ariaLabel - Accessibility label
 */
const SliderNavButton = ({ direction, onClick, visible, ariaLabel }) => {
    if (!visible) return null;

    return (
        <button
            className={`slider-nav-btn ${direction}`}
            onClick={onClick}
            aria-label={ariaLabel || `Scroll ${direction}`}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {direction === 'left' ? (
                    <polyline points="15 18 9 12 15 6"></polyline>
                ) : (
                    <polyline points="9 18 15 12 9 6"></polyline>
                )}
            </svg>
        </button>
    );
};

export default SliderNavButton;
