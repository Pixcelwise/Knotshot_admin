import React, { useEffect, useState } from 'react';

const GalleryPreview = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            setIsLoadingGallery(true);
            try {
                const response = await fetch('/api/v1/gallery?offset=0&limit=99999');
                const data = await response.json();
                setGalleryImages(data.data || []);
            } catch (err) {
                console.error('Failed to fetch gallery images', err);
            } finally {
                setIsLoadingGallery(false);
            }
        };
        fetchGalleryImages();
    }, []);

    const handleSelect = (id) => {
        setSelectedImages((prev) =>
            prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedImages(galleryImages.map(img => img._id));
    };

    const handleClearSelection = () => {
        setSelectedImages([]);
    };

    const handleDeleteSelected = async () => {
        if (selectedImages.length === 0) return;
        setIsDeleting(true);
        try {
            const response = await fetch('/api/v1/gallery/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedImages }),
            });
            if (response.ok) {
                setGalleryImages((prev) => prev.filter((img) => !selectedImages.includes(img._id)));
                setSelectedImages([]);
                alert('Selected images deleted successfully!');
            } else {
                const errorData = await response.json();
                alert('Failed to delete images: Unknown error');
            }
        } catch (err) {
            console.error('Failed to delete images', err);
            alert('Failed to delete images: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-16 mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
                <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                    Gallery
                </span>
            </h2>
            <div className="flex justify-center gap-4 mb-6">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium shadow hover:bg-blue-600 transition"
                    onClick={handleSelectAll}
                    disabled={galleryImages.length === 0}
                >
                    Select All
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium shadow hover:bg-gray-400 transition"
                    onClick={handleClearSelection}
                    disabled={selectedImages.length === 0}
                >
                    Clear Selection
                </button>
                {selectedImages.length > 0 && (
                    <button
                        className="px-6 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition"
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {isDeleting ? 'Deleting...' : `Delete Selected (${selectedImages.length})`}
                    </button>
                )}
            </div>
            {isLoadingGallery ? (
                <p className="text-center text-gray-500">Loading images...</p>
            ) : galleryImages.length === 0 ? (
                <p className="text-center text-gray-400">No images uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {galleryImages.map((img, idx) => {
                        const selected = selectedImages.includes(img._id);
                        return (
                            <div
                                key={img._id || idx}
                                className={`relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-2xl group`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => handleSelect(img._id)}
                                    className="absolute top-4 left-4 w-6 h-6 accent-pink-500 z-10 cursor-pointer"
                                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                />
                                <div className="relative">
                                    <img
                                        src={img.image || img.imageUrl}
                                        alt={img.category || `Gallery ${idx + 1}`}
                                        className={`w-full h-56 object-cover rounded-xl transition duration-200 ${selected ? 'opacity-60' : 'opacity-100'}`}
                                    />
                                    {selected && (
                                        <div className="absolute inset-0 bg-pink-500 bg-opacity-30 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col items-center">
                                    <span className="text-base font-semibold text-gray-800 mb-1">{img.category}</span>
                                    <span className="text-xs text-gray-400">{img._id}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GalleryPreview;