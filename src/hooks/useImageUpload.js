import { useState } from 'react';

/**
 * Custom hook for managing image upload and cropping workflow
 * @param {Function} onImageCropped - Callback when image is cropped (receives base64 string)
 * @returns {Object} - { imageSrc, showCropper, handleFileChange, onCropComplete, onCropCancel }
 */
export const useImageUpload = (onImageCropped) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
                setShowCropper(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedImageBase64) => {
        onImageCropped(croppedImageBase64);
        setShowCropper(false);
        setImageSrc(null);
    };

    const onCropCancel = () => {
        setShowCropper(false);
        setImageSrc(null);
    };

    return {
        imageSrc,
        showCropper,
        handleFileChange,
        onCropComplete,
        onCropCancel
    };
};
