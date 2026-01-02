import PhotoSlider from './PhotoSlider';
import About from './About';
import Courses from './Courses';
import Testimonials from './Testimonials';
import Faculty from './Faculty';
import Contact from './Contact';
import SEO from './common/SEO';

const Home = () => {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Rane's Computer & Typing Institute",
        "url": "https://rcti.com",
        "logo": "https://rcti.com/vite.svg",
        "sameAs": [
            "https://www.facebook.com/rcti",
            "https://www.instagram.com/rcti"
        ],
        "description": "Rane's Computer and Typing Institute offers high-quality computer education and typing training.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "City Name",
            "addressRegion": "State",
            "addressCountry": "IN"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9876543210",
            "contactType": "customer service"
        }
    };

    return (
        <>
            <SEO
                title="Home"
                description="Welcome to Rane's Computer and Typing Institute. We offer best-in-class computer programming, typing, and software development courses."
                url="/"
                schema={organizationSchema}
            />
            <PhotoSlider />
            <About />
            <Courses />
            <Faculty />
            <Testimonials />
            <Contact />
        </>
    );
};

export default Home;
