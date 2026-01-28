import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './FAQ.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What computer courses does RCTI offer?",
            answer: "We offer a wide range of government-certified courses including MSCIT, Tally with GST, Web Development, Graphic Design, C/C++/Java Programming, and Advanced Excel. We also provide specialized typing courses for English and Marathi."
        },
        {
            question: "Is Rane's Computer Institute government certified?",
            answer: "Yes, we are a government-recognized institute and an Authorized MKCL Training Center. Our certifications are valid for government jobs and are widely recognized in the industry."
        },
        {
            question: "What are the batch timings for students and working professionals?",
            answer: "We offer flexible batch timings from 8:00 AM to 10:00 PM (Monday to Saturday) to accommodate students, working professionals, and homemakers. Sunday batches are also available from 9:00 AM to 12:00 PM."
        },
        {
            question: "Where is the institute located in Ghatkopar?",
            answer: "We are centrally located at Shop no 7, Lingeshwar Apartment, near Saraswat Bank, Bhatwadi, Kaju Pada, Ghatkopar West, Mumbai. It is easily accessible from Ghatkopar Railway Station and Metro Station."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Generate FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="faq-section" id="faq">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <div className="container">
                <div className="section-header text-center mb-12">
                    <h2 className="section-title">Common Queries</h2>
                    <p className="section-subtitle">
                        Find answers to the most frequently asked questions about our courses and institute
                    </p>
                </div>

                <div className="faq-container">
                    <div className="faq-grid">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={activeIndex === index}
                                >
                                    {faq.question}
                                    <span className="faq-icon">+</span>
                                </button>
                                <div
                                    className="faq-answer"
                                    style={{ height: activeIndex === index ? 'auto' : '0' }}
                                >
                                    <div className="faq-answer-content">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
