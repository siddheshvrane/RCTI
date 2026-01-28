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
const FAQ = React.lazy(() => import('./FAQ'));

const LoadingFallback = () => (
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Loading section...
    </div>
);

const Home = () => {
    return (
        <>
            <SEO
                title="Best Computer & Typing Classes in Ghatkopar"
                description="Join Rane's Computer & Typing Institute in Ghatkopar, Mumbai for Government Certified Typing (GCC-TBC), MSCIT, Tally Prime, Python, and Java courses. 100% practical training."
                keywords="computer classes near me, typing institute Ghatkopar, MSCIT classes, GCC-TBC typing exam, Tally course, Python programming, Java classes, best computer institute Mumbai"
                url="/"
            />
            <PhotoSlider />
            <Suspense fallback={<LoadingFallback />}>
                <About />
                <Courses />
                <Faculty />
                <Testimonials />
                <LifeAtRCTI />
                <FAQ />
                <Contact />
            </Suspense>
        </>
    );
};

export default Home;

