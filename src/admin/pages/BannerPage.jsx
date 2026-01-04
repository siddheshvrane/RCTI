import { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { MdUpload, MdArrowUpward, MdArrowDownward, MdDelete, MdAdd } from 'react-icons/md';
import ImageCropper from '../components/ImageCropper';
import { useImageUpload } from '../../hooks/useImageUpload';

const BannerPage = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use custom hook for image upload
    const { imageSrc, showCropper, handleFileChange, onCropComplete, onCropCancel } = useImageUpload(async (croppedImage) => {
        // Add banner with cropped image
        try {
            await mockApi.addBanner({ imageUrl: croppedImage });
            loadBanners();
        } catch (error) {
            console.error('Error adding banner:', error);
            alert('Failed to add banner');
        }
    });

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setIsLoading(true);
        try {
            const data = await mockApi.getBanners();
            setBanners(data);
        } catch (error) {
            console.error('Error loading banners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReorder = async (id, direction) => {
        try {
            const updatedBanners = await mockApi.reorderBanner(id, direction);
            setBanners(updatedBanners);
        } catch (error) {
            console.error('Error reordering banner:', error);
            alert('Failed to reorder banner');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await mockApi.deleteBanner(id);
                loadBanners();
            } catch (error) {
                console.error('Error deleting banner:', error);
                alert('Failed to delete banner');
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
                    aspect={19 / 5}
                />
            )}

            <div className="admin-page-header">
                <h2 className="admin-page-title">Manage Homepage Banners</h2>
                <label className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <MdAdd /> <MdUpload /> Upload New Banner
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)', fontSize: '1.1rem' }}>
                    Loading banners...
                </div>
            ) : (
                <div className="admin-form-container">
                    <h3 className="admin-form-title">
                        Current Banners ({banners.length})
                    </h3>

                    {banners.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
                            <p>No banners uploaded yet.</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Click "Upload New Banner" to add your first banner.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                            {banners.map((banner, index) => (
                                <div
                                    key={banner._id}
                                    className="admin-list-card flex-stack-mobile"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-4)',
                                        padding: 'var(--spacing-4)'
                                    }}
                                >
                                    {/* Order Number */}
                                    <div style={{
                                        fontSize: 'var(--text-2xl)',
                                        fontWeight: 700,
                                        color: 'var(--color-primary)',
                                        minWidth: '40px',
                                        textAlign: 'center'
                                    }}>
                                        #{index + 1}
                                    </div>

                                    {/* Banner Preview */}
                                    <div style={{
                                        flex: 1,
                                        height: '120px',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        border: '2px solid var(--color-gray-200)',
                                        // width: '100%' // Removed to fix layout issue
                                    }}>
                                        <img
                                            src={banner.imageUrl}
                                            alt={`Banner ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--spacing-2)', width: '100%', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleReorder(banner._id, 'up')}
                                            disabled={index === 0}
                                            className="action-btn"
                                            title="Move Up"
                                            style={{
                                                minWidth: '44px',
                                                minHeight: '44px',
                                                opacity: index === 0 ? 0.3 : 1,
                                                cursor: index === 0 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <MdArrowUpward />
                                        </button>
                                        <button
                                            onClick={() => handleReorder(banner._id, 'down')}
                                            disabled={index === banners.length - 1}
                                            className="action-btn"
                                            title="Move Down"
                                            style={{
                                                minWidth: '44px',
                                                minHeight: '44px',
                                                opacity: index === banners.length - 1 ? 0.3 : 1,
                                                cursor: index === banners.length - 1 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <MdArrowDownward />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
                                            className="action-btn delete"
                                            title="Delete"
                                            style={{
                                                minWidth: '44px',
                                                minHeight: '44px'
                                            }}
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
                            <li>Banners are displayed in the order shown above</li>
                            <li>Use ↑ and ↓ arrows to reorder banners</li>
                            <li>Recommended image ratio: 19:5 or 3.8:1 (e.g., 1920x500)</li>
                            <li>Images will be automatically cropped to fit</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerPage;
