import React from 'react';

/**
 * Reusable star rating display component
 * @param {number} rating - Rating value (1-5)
 * @param {string} className - Optional CSS class
 */
const StarRating = ({ rating, className = '' }) => {
    return (
        <div className={`stars ${className}`}>
            {[...Array(5)].map((_, index) => (
                <span key={index} className={index < rating ? 'star filled' : 'star'}>
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;
