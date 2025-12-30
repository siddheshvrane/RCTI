const API_URL = 'http://localhost:5000/api';

export const mockApi = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Invalid credentials');
        return response.json();
    },

    // Courses
    getCourses: async () => {
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        return response.json();
    },
    addCourse: async (course) => {
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course)
        });
        if (!response.ok) throw new Error('Failed to add course');
        return response.json();
    },
    updateCourse: async (id, updatedData) => {
        const response = await fetch(`${API_URL}/courses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error('Failed to update course');
        return response.json();
    },
    deleteCourse: async (id) => {
        const response = await fetch(`${API_URL}/courses/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete course');
        return response.json();
    },

    // Faculty
    getFaculty: async () => {
        const response = await fetch(`${API_URL}/faculty`);
        if (!response.ok) throw new Error('Failed to fetch faculty');
        return response.json();
    },
    addFaculty: async (faculty) => {
        const response = await fetch(`${API_URL}/faculty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(faculty)
        });
        if (!response.ok) throw new Error('Failed to add faculty');
        return response.json();
    },
    updateFaculty: async (id, updatedData) => {
        const response = await fetch(`${API_URL}/faculty/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error('Failed to update faculty');
        return response.json();
    },
    deleteFaculty: async (id) => {
        const response = await fetch(`${API_URL}/faculty/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete faculty');
        return response.json();
    },

    // Testimonials
    getTestimonials: async () => {
        const response = await fetch(`${API_URL}/testimonials`);
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        return response.json();
    },
    addTestimonial: async (testimonial) => {
        const response = await fetch(`${API_URL}/testimonials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testimonial)
        });
        if (!response.ok) throw new Error('Failed to add testimonial');
        return response.json();
    },
    updateTestimonial: async (id, updatedData) => {
        const response = await fetch(`${API_URL}/testimonials/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error('Failed to update testimonial');
        return response.json();
    },
    deleteTestimonial: async (id) => {
        const response = await fetch(`${API_URL}/testimonials/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete testimonial');
        return response.json();
    },

    // Banners
    getBanners: async () => {
        const response = await fetch(`${API_URL}/banners`);
        if (!response.ok) throw new Error('Failed to fetch banners');
        return response.json();
    },
    addBanner: async (banner) => {
        const response = await fetch(`${API_URL}/banners`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(banner)
        });
        if (!response.ok) throw new Error('Failed to add banner');
        return response.json();
    },
    updateBanner: async (id, updatedData) => {
        const response = await fetch(`${API_URL}/banners/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error('Failed to update banner');
        return response.json();
    },
    reorderBanner: async (id, direction) => {
        const response = await fetch(`${API_URL}/banners/${id}/reorder`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction })
        });
        if (!response.ok) throw new Error('Failed to reorder banner');
        return response.json();
    },
    deleteBanner: async (id) => {
        const response = await fetch(`${API_URL}/banners/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete banner');
        return response.json();
    }
};
