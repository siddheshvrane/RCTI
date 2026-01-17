import { useState } from 'react';
import { compressImage } from '../utils/imageUtils';

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

    const onCropComplete = async (croppedImageBase64) => {
        try {
            // Convert Base64 to Blob to pass to compressImage utility, 
            // OR ensure compressImage handles Base64 (it expects File currently).
            // Let's assume we import a utility that handles this or we transform it.
            // Simplified: Convert base64 to blob/file
            const fetchRes = await fetch(croppedImageBase64);
            const blob = await fetchRes.blob();
            const file = new File([blob], "image.jpg", { type: "image/jpeg" });

            const compressedBase64 = await compressImage(file);
            onImageCropped(compressedBase64);
        } catch (error) {
            console.error("Compression failed", error);
            onImageCropped(croppedImageBase64); // Fallback to original
        }
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
