import React, { Suspense } from 'react';
import PhotoSlider from './PhotoSlider';
import SEO from './common/SEO';

// Lazy load heavy components
const About = React.lazy(() => import('./About'));
const Courses = React.lazy(() => import('./Courses'));
const Testimonials = React.lazy(() => import('./Testimonials'));
const Faculty = React.lazy(() => import('./Faculty'));
const Contact = React.lazy(() => import('./Contact'));
const LifeAtRCTI = React.lazy(() => import('./LifeAtRCTI'));

const LoadingFallback = () => (
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Loading section...
    </div>
);

const Home = () => {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "name": "Rane's Computer & Typing Institute",
        "url": "https://www.ranescomputer.in",
        "logo": "https://www.ranescomputer.in/RCTI.png", // Use actual logo URL
        "sameAs": [
            "https://www.facebook.com/share/1NAruT9GD5/",
            "https://www.instagram.com/ranescomputer?igsh=MXByMDM3c3pmNnR3NQ=="
        ],
        "description": "Rane's Computer and Typing Institute in Ghatkopar West offers government-certified typing courses (GCC-TBC), MSCIT, CCC, Tally, and programming classes.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Shop no 7, Lingeshwar Apartment, near Saraswat Bank, Bhatwadi, Kaju Pada, Ghatkopar West",
            "addressLocality": "Mumbai",
            "addressRegion": "Maharashtra",
            "postalCode": "400084",
            "addressCountry": "IN"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9869855785",
            "contactType": "customer service"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "19.099", // Approximate for Ghatkopar West
            "longitude": "72.910"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "07:00",
                "closes": "21:00"
            }
        ],
        "priceRange": "$$"
    };

    return (
        <>
            <SEO
                title="Best Computer & Typing Classes in Ghatkopar"
                description="Join Rane's Computer & Typing Institute in Ghatkopar, Mumbai for Government Certified Typing (GCC-TBC), MSCIT, Tally Prime, Python, and Java courses. 100% practical training."
                keywords="computer classes near me, typing institute Ghatkopar, MSCIT classes, GCC-TBC typing exam, Tally course, Python programming, Java classes, best computer institute Mumbai"
                url="/"
                schema={organizationSchema}
            />
            <PhotoSlider />
            <Suspense fallback={<LoadingFallback />}>
                <About />
                <Courses />
                <Faculty />
                <Testimonials />
                <LifeAtRCTI />
                <Contact />
            </Suspense>
        </>
    );
};

export default Home;
