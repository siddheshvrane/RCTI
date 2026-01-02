import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Home from './components/Home';
import CourseDetail from './components/CourseDetail';
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/layouts/AdminLayout';
import CoursePage from './admin/pages/CoursePage';
import FacultyPage from './admin/pages/FacultyPage';
import TestimonialsPage from './admin/pages/TestimonialsPage';
import BannerPage from './admin/pages/BannerPage';
import RegistrationPage from './admin/pages/RegistrationPage';
import Footer from './components/Footer';
import eventBus from './services/eventBus';
import './styles/index.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Subscribe to navigation events
    const navigationSubscription = eventBus.onNavigation().subscribe((data) => {
      console.log('Navigation event:', data);
    });

    // Subscribe to form submissions
    const formSubscription = eventBus.onFormSubmit().subscribe((data) => {
      console.log('Form submitted:', data);
      // Here you can add API calls to send form data to backend
    });

    // Subscribe to course inquiries
    const courseInquirySubscription = eventBus.onCourseInquiry().subscribe((data) => {
      console.log('Course inquiry:', data);
    });

    // Cleanup subscriptions on unmount
    return () => {
      navigationSubscription.unsubscribe();
      formSubscription.unsubscribe();
      courseInquirySubscription.unsubscribe();
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <HelmetProvider>
      <div className="App">
        {!isAdminRoute && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/:id" element={<CourseDetail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route path="courses" element={<CoursePage />} />
              <Route path="faculty" element={<FacultyPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="banners" element={<BannerPage />} />
              <Route path="registrations" element={<RegistrationPage />} />
              {/* Default redirect to courses */}
              <Route index element={<CoursePage />} />
            </Route>
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </HelmetProvider>
  );
}

export default App;
