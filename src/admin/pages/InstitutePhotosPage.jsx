import { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { MdUpload, MdArrowUpward, MdArrowDownward, MdDelete, MdAdd, MdDragIndicator } from 'react-icons/md';
import ImageCropper from '../components/ImageCropper';
import { useImageUpload } from '../../hooks/useImageUpload';

// DnD Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
const SortablePhotoItem = ({ photo, index, isFirst, isLast, handleReorder, handleDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: photo._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-3)',
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="admin-list-card"
            {...attributes}
            {...listeners}
        >
            {/* Drag Handle & Index */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>#{index + 1}</span>
            </div>

            {/* Photo Preview */}
            <div style={{
                height: '200px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-gray-200)',
                position: 'relative'
            }}>
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
            <div
                style={{ display: 'flex', flexDirection: 'row', gap: 'var(--spacing-2)', justifyContent: 'space-between', marginTop: '5px' }}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                        onClick={() => handleReorder(photo._id, 'up')}
                        disabled={isFirst}
                        className="action-btn"
                        title="Move Backward"
                        style={{
                            opacity: isFirst ? 0.3 : 1,
                            cursor: isFirst ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <MdArrowUpward style={{ transform: 'rotate(-90deg)' }} /> {/* Left arrow visual for grid */}
                    </button>
                    <button
                        onClick={() => handleReorder(photo._id, 'down')}
                        disabled={isLast}
                        className="action-btn"
                        title="Move Forward"
                        style={{
                            opacity: isLast ? 0.3 : 1,
                            cursor: isLast ? 'not-allowed' : 'pointer'
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
    );
};

const InstitutePhotosPage = () => {
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Press and move 5px to start dragging
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPhotos((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update backend
                const reorderPayload = newItems.map((item, index) => ({
                    id: item._id,
                    order: index
                }));

                mockApi.reorderInstitutePhotosBatch(reorderPayload).catch(err => {
                    console.error('Failed to save order:', err);
                    alert('Failed to save new order. Reloading...');
                    loadPhotos();
                });

                return newItems;
            });
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
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={photos.map(p => p._id)}
                                strategy={rectSortingStrategy}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
                                    {photos.map((photo, index) => (
                                        <SortablePhotoItem
                                            key={photo._id}
                                            photo={photo}
                                            index={index}
                                            isFirst={index === 0}
                                            isLast={index === photos.length - 1}
                                            handleReorder={handleReorder}
                                            handleDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
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
                            <li>Drag and drop items using the <MdDragIndicator style={{ verticalAlign: 'middle' }} /> handle to reorder.</li>
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

