import { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { useDynamicFields } from '../../hooks/useDynamicFields';
import DynamicFieldManager from '../../components/common/DynamicFieldManager';

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        review: '',
        result: ''
    });

    // Use custom hook for courses
    const { fields: courses, addField: addCourse, removeField: removeCourse, updateField: updateCourse, setFields: setCourses } = useDynamicFields([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const testimonialsData = await mockApi.getTestimonials();
            const coursesData = await mockApi.getCourses();
            setTestimonials(testimonialsData);
            setAvailableCourses(coursesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrent(item);
        setFormData({
            name: item.name,
            rating: item.rating,
            review: item.review,
            result: item.result || ''
        });
        // Migration: If item has 'course' (string) but no 'courses' (array), convert it
        let coursesArray = item.courses || [];
        if (coursesArray.length === 0 && item.course) {
            coursesArray = [item.course];
        }
        setCourses(coursesArray);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this testimonial?')) {
            await mockApi.deleteTestimonial(id);
            loadData();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', rating: 5, review: '', result: '' });
        setCourses([]);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedData = {
            ...formData,
            // Main 'course' field is legacy, but we can set it to the first course for backward compatibility
            course: courses.length > 0 ? courses[0] : '',
            courses: courses.filter(c => c !== '')
        };

        if (isEditing) {
            await mockApi.updateTestimonial(current.id, cleanedData);
        } else {
            await mockApi.addTestimonial(cleanedData);
        }
        resetForm();
        loadData();
    };

    const courseOptions = availableCourses.map(c => ({ value: c.title, label: c.title }));

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Manage Testimonials</h2>
                <button
                    className="btn btn-primary"
                    onClick={resetForm}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <MdAdd /> Add New
                </button>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)', fontSize: '1.1rem' }}>
                    Loading testimonials and courses...
                </div>
            ) : (
                <div className="admin-grid">
                    <div className="admin-form-container">
                        <h3 className="admin-form-title">
                            {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </h3>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-input-group">
                                <input
                                    type="text"
                                    placeholder="Student Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                            </div>

                            {/* Courses Section - Using DynamicFieldManager */}
                            <DynamicFieldManager
                                label="Course"
                                fields={courses}
                                options={courseOptions}
                                onAdd={addCourse}
                                onRemove={removeCourse}
                                onChange={updateCourse}
                                placeholder="Select Course"
                            />

                            <div className="admin-input-group flex-stack-mobile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ color: 'var(--color-gray-700)', fontWeight: 500 }}>Rating:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                    className="admin-input"
                                    style={{ width: '80px' }}
                                />
                            </div>
                            <div className="admin-input-group">
                                <input
                                    type="text"
                                    placeholder="Result / Achievement"
                                    value={formData.result}
                                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-input-group">
                                <textarea
                                    placeholder="Review"
                                    value={formData.review}
                                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                    rows="4"
                                    required
                                    className="admin-textarea"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                {isEditing ? 'Update Testimonial' : 'Add Testimonial'}
                            </button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="admin-list-container">
                        {testimonials.map(item => (
                            <div key={item.id} className="admin-list-card">
                                <div>
                                    <h4 className="card-title">{item.name}</h4>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-orange)', marginBottom: '5px' }}>{'★'.repeat(item.rating)}</div>
                                    <p className="card-subtitle" style={{ fontStyle: 'italic' }}>"{item.review}"</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '5px' }}>
                                        {(item.courses && item.courses.length > 0) ? item.courses.join(', ') : item.course}
                                        {item.result && ` | ${item.result}`}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="action-btn edit"
                                        title="Edit"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <MdEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="action-btn delete"
                                        title="Delete"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialsPage;
