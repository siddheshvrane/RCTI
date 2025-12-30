import { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { MdEdit, MdDelete, MdAdd, MdUpload } from 'react-icons/md';
import ImageCropper from '../components/ImageCropper';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useDynamicFields } from '../../hooks/useDynamicFields';
import DynamicFieldManager from '../../components/common/DynamicFieldManager';

const FacultyPage = () => {
    const [faculty, setFaculty] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        qualification: '',
        experience: '',
        experienceYears: 0,
        joinedYear: new Date().getFullYear(),
        imageUrl: ''
    });

    // Use custom hooks
    const { fields: courses, addField: addCourse, removeField: removeCourse, updateField: updateCourse, setFields: setCourses } = useDynamicFields([]);
    const { imageSrc, showCropper, handleFileChange, onCropComplete, onCropCancel } = useImageUpload((croppedImage) => {
        setFormData({ ...formData, imageUrl: croppedImage });
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const facultyData = await mockApi.getFaculty();
            const coursesData = await mockApi.getCourses();
            setFaculty(facultyData);
            setAvailableCourses(coursesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (member) => {
        setIsEditing(true);
        setCurrentMember(member);
        setFormData({
            name: member.name,
            position: member.position,
            qualification: member.qualification,
            experience: member.experience,
            imageUrl: member.imageUrl || ''
        });
        // Map populated course objects to IDs for the form
        const courseIds = member.courses ? member.courses.map(c => c._id) : [];
        setCourses(courseIds);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this faculty member?')) {
            await mockApi.deleteFaculty(id);
            loadData();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', position: '', qualification: '', experience: '', imageUrl: '' });
        setCourses([]);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedData = {
            ...formData,
            courses: courses.filter(c => c !== '')
        };

        if (isEditing) {
            await mockApi.updateFaculty(currentMember._id, cleanedData);
        } else {
            await mockApi.addFaculty(cleanedData);
        }
        resetForm();
        loadData();
    };

    const courseOptions = availableCourses.map(c => ({ value: c._id, label: c.title }));

    return (
        <div>
            {showCropper && (
                <ImageCropper
                    imageSrc={imageSrc}
                    onCropComplete={onCropComplete}
                    onCancel={onCropCancel}
                    aspect={1}
                />
            )}

            <div className="admin-page-header">
                <h2 className="admin-page-title">Manage Faculty</h2>
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
                    Loading faculty and courses...
                </div>
            ) : (
                <div className="admin-grid">
                    <div className="admin-form-container">
                        <h3 className="admin-form-title">
                            {isEditing ? 'Edit Faculty' : 'Add New Faculty'}
                        </h3>
                        <form onSubmit={handleSubmit} className="admin-form">

                            <div className="admin-input-group flex-stack-mobile" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div
                                    className="fixed-size-container"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        minWidth: '100px', // Force fixed width
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--color-gray-100)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px solid var(--color-primary)'
                                    }}
                                >
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ color: 'var(--color-gray-400)', fontSize: '12px' }}>No Image</span>
                                    )}
                                </div>
                                <div className="full-width-mobile">
                                    <label className="file-upload-label full-width-mobile" style={{ justifyContent: 'center' }}>
                                        <MdUpload /> Upload Photo
                                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>

                            <div className="admin-input-group">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-input-group">
                                <input
                                    type="text"
                                    placeholder="Position (e.g. Senior Instructor)"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-input-group">
                                <input
                                    type="text"
                                    placeholder="Qualifications (e.g. MCA, B.Ed)"
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-input-group">
                                <input
                                    type="text"
                                    placeholder="Experience (e.g. 10 Years)"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    required
                                    className="admin-input"
                                />
                            </div>

                            {/* Assigned Courses Section - Using DynamicFieldManager */}
                            <DynamicFieldManager
                                label="Course"
                                fields={courses}
                                options={courseOptions}
                                onAdd={addCourse}
                                onRemove={removeCourse}
                                onChange={updateCourse}
                                placeholder="Select Course"
                            />

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                {isEditing ? 'Update Faculty' : 'Add Faculty'}
                            </button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="admin-list-container">
                        {faculty.map(member => (
                            <div key={member._id} className="admin-list-card">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                        src={member.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={member.name}
                                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px', border: '2px solid var(--color-gray-200)' }}
                                    />
                                    <div>
                                        <h4 className="card-title">{member.name}</h4>
                                        <p className="card-subtitle">{member.position}</p>
                                        {member.courses && member.courses.length > 0 && (
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '4px' }}>
                                                Teaches: {member.courses.map(c => c.title).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="action-btn edit"
                                        title="Edit"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <MdEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member._id)}
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

export default FacultyPage;
