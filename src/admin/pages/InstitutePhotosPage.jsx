import { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { MdUpload, MdArrowUpward, MdArrowDownward, MdDelete, MdAdd } from 'react-icons/md';
import ImageCropper from '../components/ImageCropper';
import { useImageUpload } from '../../hooks/useImageUpload';

const InstitutePhotosPage = () => {
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use custom hook for image upload
    const { imageSrc, showCropper, handleFileChange, onCropComplete, onCropCancel } = useImageUpload(async (croppedImage) => {
        // Add photo with cropped image
        try {
            await mockApi.addInstitutePhoto({ imageUrl: croppedImage });
            loadPhotos();
        } catch (error) {
            console.error('Error adding photo:', error);
            alert('Failed to add photo');
        }
    });

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        setIsLoading(true);
        try {
            const data = await mockApi.getInstitutePhotos();
            setPhotos(data);
        } catch (error) {
            console.error('Error loading photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReorder = async (id, direction) => {
        try {
            const updatedPhotos = await mockApi.reorderInstitutePhoto(id, direction);
            setPhotos(updatedPhotos);
        } catch (error) {
            console.error('Error reordering photo:', error);
            alert('Failed to reorder photo');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            try {
                await mockApi.deleteInstitutePhoto(id);
                loadPhotos();
            } catch (error) {
                console.error('Error deleting photo:', error);
                alert('Failed to delete photo');
            }
        }
    };

    return (
        <div>
            {showCropper && (
                <ImageCropper
                    imageSrc={imageSrc}
                    onCropComplete={onCropComplete}
                    onCancel={onCropCancel}
                    aspect={16 / 9} // Using 16:9 for institute photos, user can change if needed? But standard format suggested.
                />
            )}

            <div className="admin-page-header">
                <h2 className="admin-page-title">Manage Gallery Photos</h2>
                <label className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <MdAdd /> <MdUpload /> Upload New Photo
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)', fontSize: '1.1rem' }}>
                    Loading photos...
                </div>
            ) : (
                <div className="admin-form-container">
                    <h3 className="admin-form-title">
                        Current Photos ({photos.length})
                    </h3>

                    {photos.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
                            <p>No photos uploaded yet.</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Click "Upload New Photo" to add your first photo.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
                            {photos.map((photo, index) => (
                                <div
                                    key={photo._id}
                                    className="admin-list-card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--spacing-2)',
                                        padding: 'var(--spacing-3)'
                                    }}
                                >
                                    {/* Photo Preview */}
                                    <div style={{
                                        height: '200px',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        border: '1px solid var(--color-gray-200)',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '5px',
                                            left: '5px',
                                            background: 'rgba(0,0,0,0.6)',
                                            color: '#fff',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            #{index + 1}
                                        </div>
                                        <img
                                            src={photo.imageUrl}
                                            alt={`Institute Photo ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--spacing-2)', justifyContent: 'space-between', marginTop: '5px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => handleReorder(photo._id, 'up')}
                                                disabled={index === 0}
                                                className="action-btn"
                                                title="Move Backward"
                                                style={{
                                                    opacity: index === 0 ? 0.3 : 1,
                                                    cursor: index === 0 ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <MdArrowUpward style={{ transform: 'rotate(-90deg)' }} /> {/* Left arrow visual for grid */}
                                            </button>
                                            <button
                                                onClick={() => handleReorder(photo._id, 'down')}
                                                disabled={index === photos.length - 1}
                                                className="action-btn"
                                                title="Move Forward"
                                                style={{
                                                    opacity: index === photos.length - 1 ? 0.3 : 1,
                                                    cursor: index === photos.length - 1 ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <MdArrowDownward style={{ transform: 'rotate(-90deg)' }} /> {/* Right arrow visual for grid */}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(photo._id)}
                                            className="action-btn delete"
                                            title="Delete"
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{
                        marginTop: 'var(--spacing-6)',
                        padding: 'var(--spacing-4)',
                        backgroundColor: 'var(--color-gray-50)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-gray-200)'
                    }}>
                        <h4 style={{ marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-700)' }}>
                            💡 Tips
                        </h4>
                        <ul style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                            <li>Photos are displayed in a grid layout on the admin page.</li>
                            <li>Use Left/Right arrows to reorder photos (changes their display order on the homepage).</li>
                            <li>Recommended image ratio: 16:9 for best display.</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstitutePhotosPage;
