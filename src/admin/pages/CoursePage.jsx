import { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { MdEdit, MdDelete, MdAdd, MdUpload } from 'react-icons/md';
import ImageCropper from '../components/ImageCropper';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useDynamicFields } from '../../hooks/useDynamicFields';
import DynamicFieldManager from '../../components/common/DynamicFieldManager';

const CoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [availableFaculty, setAvailableFaculty] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        bannerUrl: '',
        category: 'computer',
        duration: '',
        level: 'Beginner',
        fees: '',
        description: '',
        introduction: '',
        about: '',
        objectives: '',
        outcomes: '',
        modules: ''
    });

    // Use custom hooks
    const { fields: instructors, addField: addInstructor, removeField: removeInstructor, updateField: updateInstructor, setFields: setInstructors } = useDynamicFields([]);
    const { imageSrc, showCropper, handleFileChange, onCropComplete, onCropCancel } = useImageUpload((croppedImage) => {
        setFormData({ ...formData, bannerUrl: croppedImage });
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const coursesData = await mockApi.getCourses();
            const facultyData = await mockApi.getFaculty();
            setCourses(coursesData);
            setAvailableFaculty(facultyData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (course) => {
        setIsEditing(true);
        setCurrentCourse(course);
        setFormData({
            ...course,
            objectives: Array.isArray(course.objectives) ? course.objectives.join('\n') : course.objectives,
            outcomes: Array.isArray(course.outcomes) ? course.outcomes.join('\n') : course.outcomes,
            modules: Array.isArray(course.modules) ? course.modules.join('\n') : course.modules,
            bannerUrl: course.bannerUrl || ''
        });
        // Set instructors
        const instructorIds = course.instructors ? course.instructors.map(i => {
            if (typeof i === 'string') return i;
            return i._id || '';
        }).filter(Boolean) : [];
        setInstructors(instructorIds);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await mockApi.deleteCourse(id);
            loadData();
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'computer',
            duration: '',
            level: 'Beginner',
            fees: '',
            description: '',
            introduction: '',
            about: '',
            objectives: '',
            outcomes: '',
            modules: '',
            bannerUrl: ''
        });
        setInstructors([]);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = {
            ...formData,
            objectives: typeof formData.objectives === 'string' ? formData.objectives.split('\n').filter(Boolean) : formData.objectives,
            outcomes: typeof formData.outcomes === 'string' ? formData.outcomes.split('\n').filter(Boolean) : formData.outcomes,
            modules: typeof formData.modules === 'string' ? formData.modules.split('\n').filter(Boolean) : formData.modules,
            instructors: instructors.filter(i => i !== '')
        };

        if (isEditing) {
            await mockApi.updateCourse(currentCourse._id, courseData);
        } else {
            await mockApi.addCourse(courseData);
        }
        resetForm();
        loadData();
    };

    const facultyOptions = availableFaculty.map(f => ({ value: f._id, label: f.name }));

    return (
        <div>
            {showCropper && (
                <ImageCropper
                    imageSrc={imageSrc}
                    onCropComplete={onCropComplete}
                    onCancel={onCropCancel}
                    aspect={350 / 120}
                />
            )}
            <div className="admin-page-header">
                <h2 className="admin-page-title">Manage Courses</h2>
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
                    Loading courses and faculty...
                </div>
            ) : (
                <div className="admin-grid">
                    {/* Form Section */}
                    <div className="admin-form-container">
                        <h3 className="admin-form-title">
                            {isEditing ? 'Edit Course' : 'Add New Course'}
                        </h3>
                        <form onSubmit={handleSubmit} className="admin-form">

                            <div className="admin-input-group flex-stack-mobile" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div
                                    style={{
                                        width: '350px',
                                        height: '120px',
                                        backgroundColor: 'var(--color-gray-100)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px solid var(--color-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        maxWidth: '100%' // Ensure it doesn't overflow mobile
                                    }}
                                >
                                    {formData.bannerUrl ? (
                                        <img src={formData.bannerUrl} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ color: 'var(--color-gray-400)', fontSize: '12px' }}>No Banner Image</span>
                                    )}
                                </div>
                                <div>
                                    <label className="file-upload-label full-width-mobile">
                                        <MdUpload /> Upload Banner
                                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '5px' }}>
                                        Recommended Ratio: 350x120
                                    </p>
                                </div>
                            </div>

                            <div className="admin-input-group">
                                <input
                                    type="text"
                                    placeholder="Course Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                            </div>
                            <div className="flex-stack-mobile" style={{ display: 'flex', gap: '15px' }}>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="admin-select"
                                >
                                    <option value="computer">Computer</option>
                                    <option value="typing">Typing</option>
                                </select>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="admin-select"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="flex-stack-mobile" style={{ display: 'flex', gap: '15px' }}>
                                <input
                                    type="text"
                                    placeholder="Duration (e.g. 3 Months)"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Fees (e.g. ₹5000)"
                                    value={formData.fees}
                                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                            </div>

                            {/* Instructors Section - Using DynamicFieldManager */}
                            <DynamicFieldManager
                                label="Instructor"
                                fields={instructors}
                                options={facultyOptions}
                                onAdd={addInstructor}
                                onRemove={removeInstructor}
                                onChange={updateInstructor}
                                placeholder="Select Instructor"
                            />

                            <textarea
                                placeholder="Short Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="2"
                                className="admin-textarea"
                            />
                            <textarea
                                placeholder="Introduction (Detailed)"
                                value={formData.introduction}
                                onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                                rows="3"
                                className="admin-textarea"
                            />
                            <textarea
                                placeholder="About this course (Detailed)"
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                rows="3"
                                className="admin-textarea"
                            />
                            <textarea
                                placeholder="Objectives (One per line)"
                                value={formData.objectives}
                                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                                rows="3"
                                className="admin-textarea"
                            />
                            <textarea
                                placeholder="Outcomes (One per line)"
                                value={formData.outcomes}
                                onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                                rows="3"
                                className="admin-textarea"
                            />
                            <textarea
                                placeholder="Modules (One per line)"
                                value={formData.modules}
                                onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
                                rows="3"
                                className="admin-textarea"
                            />
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                {isEditing ? 'Update Course' : 'Add Course'}
                            </button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="admin-list-container">
                        {courses.map(course => (
                            <div key={course._id} className="admin-list-card">
                                <div>
                                    <h4 className="card-title">{course.title}</h4>
                                    <p className="card-subtitle">{course.category} | {course.level}</p>
                                    {course.instructors && course.instructors.length > 0 && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '4px' }}>
                                            Instructors: {course.instructors.map(i => i.name).join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="action-btn edit"
                                        title="Edit"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <MdEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id)}
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

export default CoursePage;
