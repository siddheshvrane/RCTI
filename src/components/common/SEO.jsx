import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = "Rane's Computer & Typing Institute";
    const defaultDescription = "Rane's Computer and Typing Institute in Ghatkopar West, Mumbai. Best computer classes for MSCIT, CCC, Tally, Python, and Government Certified Typing courses.";
    const defaultKeywords = "computer classes near me, typing classes near me, computer institute Ghatkopar, MSCIT classes Mumbai, GCC-TBC typing, coding classes, Rane's Computer Institute";
    const defaultImage = "/RCTI.png";
    const siteUrl = "https://www.ranescomputer.in";

    // Logic to ensure absolute URLs and proper fallbacks (Restored)
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || defaultKeywords;
    const finalImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}${defaultImage}`;
    const finalUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;

    const [coursesSchema, setCoursesSchema] = useState([]);
    const [facultySchema, setFacultySchema] = useState([]);

    // Fetch Dynamic Data from MongoDB for Schema
    useEffect(() => {
        const fetchSchemaData = async () => {
            try {
                // Parallel fetch for Courses and Faculty
                const [coursesRes, facultyRes] = await Promise.all([
                    fetch('/api/courses'),
                    fetch('/api/faculty')
                ]);

                // 1. Process Courses Schema
                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    const courseList = Array.isArray(data) ? data : (data.data || []);

                    const cSchema = courseList.map(course => ({
                        "@type": "Course",
                        "name": course.title,
                        "description": course.description,
                        "provider": {
                            "@type": "Organization",
                            "name": "Rane's Computer and Typing Institute",
                            "sameAs": "https://ranescomputer.in"
                        },
                        "offers": {
                            "@type": "Offer",
                            "category": "Educational",
                            "priceCurrency": "INR",
                            "price": course.fees ? course.fees.replace(/[^0-9]/g, '') : "0",
                            "availability": "https://schema.org/InStock"
                        },
                        "hasCourseInstance": {
                            "@type": "CourseInstance",
                            "mode": "part-time",
                            "courseWorkload": course.duration
                        }
                    }));
                    setCoursesSchema(cSchema);
                }

                // 2. Process Faculty Schema (E-E-A-T)
                if (facultyRes.ok) {
                    const data = await facultyRes.json();
                    const facultyList = Array.isArray(data) ? data : (data.data || []);

                    const fSchema = facultyList.map(member => ({
                        "@type": "Person",
                        "name": member.name,
                        "jobTitle": member.position,
                        "description": `${member.name} has ${member.experience} years of experience in ${member.courses?.map(c => c.title).join(', ') || 'Computer Education'}. Qualification: ${member.qualification}`,
                        "worksFor": {
                            "@type": "Organization",
                            "name": "Rane's Computer and Typing Institute"
                        },
                        "image": member.imageUrl || "https://ranescomputer.in/RCTI.png"
                    }));
                    setFacultySchema(fSchema);
                }
            } catch (error) {
                console.error("Failed to fetch data for SEO schema", error);
            }
        };

        fetchSchemaData();
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "@id": "https://ranescomputer.in/#organization",
                "name": "Rane's Computer and Typing Institute",
                "alternateName": "RCTI",
                "url": "https://ranescomputer.in/",
                "logo": "https://ranescomputer.in/RCTI.png",
                "image": "https://ranescomputer.in/RCTI.png",
                "description": "Best computer classes and typing institute in Ghatkopar, Mumbai. Government certified courses in MSCIT, Tally, Java, Python, Web Development, and Graphic Design.",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Shop no 7, Lingeshwar Apartment, near Saraswat Bank, Bhatwadi, Kaju Pada, Ghatkopar West",
                    "addressLocality": "Mumbai",
                    "addressRegion": "Maharashtra",
                    "postalCode": "400084",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "19.0911", // Approx lat for Ghatkopar West
                    "longitude": "72.9012"
                },
                "hasMap": "https://www.google.com/maps?q=RANE'S+COMPUTER+INSTITUTE+Shop+no+7,+near+Saraswat+Bank,+Bhatwadi,+Kaju+Pada,+Ghatkopar+West,+Mumbai,+Maharashtra+400084",
                "telephone": "+91-9869855785",
                "email": "ranescomputer@gmail.com",
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        "opens": "08:00",
                        "closes": "22:00"
                    },
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": "Sunday",
                        "opens": "09:00",
                        "closes": "12:00"
                    }
                ],
                "sameAs": [
                    "https://www.google.com/maps?q=RANE'S+COMPUTER+INSTITUTE+Shop+no+7,+near+Saraswat+Bank,+Bhatwadi,+Kaju+Pada,+Ghatkopar+West,+Mumbai,+Maharashtra+400084",
                    "https://www.facebook.com/share/1NAruT9GD5/",
                    "https://www.instagram.com/ranescomputer?igsh=MXByMDM3c3pmNnR3NQ==",
                    "https://www.youtube.com/ranescomputer"
                ],
                "employee": facultySchema // Link Faculty to the Organization
            },
            ...coursesSchema,
            ...facultySchema // Also list Person entities at root level of graph
        ]
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />

            {/* Structured Data JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string
};

export default SEO;
