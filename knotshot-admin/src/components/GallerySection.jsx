import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

import GalleryPreview from './Previews/GalleryPreview';

const GalleryUpload = () => {
  // Single upload state
  const [singleFile, setSingleFile] = useState(null);
  const [singleCategory, setSingleCategory] = useState('');
  const [isSingleUploading, setIsSingleUploading] = useState(false);

  // Multiple upload state
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [multipleCategory, setMultipleCategory] = useState('');
  const [isMultipleUploading, setIsMultipleUploading] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      setIsLoadingGallery(true);
      try {
        const response = await fetch('/api/v1/gallery', {
          params: {
            offset,
            limit: 1000,
          },
        }
        );
        const data = await response.json();
        // Assuming data.data is an array of { imageUrl, category }
        setGalleryImages(data.data || []);
      } catch (err) {
        console.error('Failed to fetch gallery images', err);
      } finally {
        setIsLoadingGallery(false);
      }
    };
    fetchGalleryImages();
  }, [isSingleUploading, isMultipleUploading]);
  // refetch after upload

  // Single file upload handlers
  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };

  const handleSingleUpload = async () => {
    if (!singleCategory.trim() || !singleFile) {
      alert('Please select an image and enter a category.');
      return;
    }

    const formData = new FormData();
    let file = singleFile;

    // Compress if larger than 10MB
    if (file.size > 10485760) {
      const options = {
        maxSizeMB: 8,
        useWebWorker: true,
      };
      file = await imageCompression(file, options);
      console.log(`Compressed single image: ${singleFile.name} from ${singleFile.size} → ${file.size} bytes`);
    }

    formData.append('images', file);
    formData.append('category', singleCategory);

    try {
      setIsSingleUploading(true);
      const response = await fetch('/api/v1/gallery/image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('✅ Image uploaded successfully!');
        setSingleFile(null);
        setSingleCategory('');
        // Reset file input
        document.getElementById('single-file-input').value = '';
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed!');
    } finally {
      setIsSingleUploading(false);
    }
  };

  // Multiple files upload handlers
  const handleMultipleFileChange = (e) => {
    setMultipleFiles(Array.from(e.target.files));
  };

  const handleMultipleUpload = async () => {
    if (!multipleCategory.trim() || multipleFiles.length === 0) {
      alert('Please select images and enter a category.');
      return;
    }

    const formData = new FormData();

    for (const file of multipleFiles) {
      let compressedFile = file;
      if (file.size > 10485760) {
        const options = {
          maxSizeMB: 8,
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, options);
        console.log(`Compressed bulk image: ${file.name} from ${file.size} → ${compressedFile.size} bytes`);
      }
      formData.append('images', compressedFile);
    }
    formData.append('category', multipleCategory);

    try {
      setIsMultipleUploading(true);
      const response = await fetch('/api/v1/gallery/image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('✅ Images uploaded successfully!');
        setMultipleFiles([]);
        setMultipleCategory('');
        // Reset file input
        document.getElementById('multiple-file-input').value = '';
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed!');
    } finally {
      setIsMultipleUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-extrabold text-black mb-4">Gallery Upload</h1>
        <p className="text-gray-600 text-xl">Choose your preferred upload method</p>
      </div>

      {/* Gallery Images Section */}
      <GalleryPreview />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Single Image Upload Section */}
        <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-black mb-2">Single Upload</h2>
            <p className="text-gray-600">Upload one image at a time</p>
          </div>

          <div className="space-y-6">
            {/* Category Input */}
            <div>
              <label className="block text-black font-bold mb-3 text-lg">Category</label>
              <input
                type="text"
                value={singleCategory}
                onChange={(e) => setSingleCategory(e.target.value)}
                placeholder="Enter image category"
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:border-black transition-all duration-200"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-black font-bold mb-3 text-lg">Select Image</label>
              <input
                id="single-file-input"
                type="file"
                accept="image/*"
                onChange={handleSingleFileChange}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
              />
            </div>

            {/* Image Preview */}
            {singleFile && (
              <div className="flex justify-center">
                <img
                  src={URL.createObjectURL(singleFile)}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                />
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleSingleUpload}
              disabled={isSingleUploading}
              className={`w-full bg-black text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 ${isSingleUploading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                }`}
            >
              {isSingleUploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>

        {/* Multiple Images Upload Section */}
        <div className="bg-black text-white border-2 border-black rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Bulk Upload</h2>
            <p className="text-gray-300">Upload multiple images at once</p>
          </div>

          <div className="space-y-6">
            {/* Category Input */}
            <div>
              <label className="block text-white font-bold mb-3 text-lg">Category</label>
              <input
                type="text"
                value={multipleCategory}
                onChange={(e) => setMultipleCategory(e.target.value)}
                placeholder="Enter images category"
                className="w-full border-2 border-gray-600 bg-gray-800 text-white rounded-lg p-4 text-lg focus:outline-none focus:border-white transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-white font-bold mb-3 text-lg">Select Images</label>
              <input
                id="multiple-file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFileChange}
                className="w-full border-2 border-gray-600 bg-gray-800 text-white rounded-lg p-4 text-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
              />
            </div>

            {/* Image Previews */}
            {multipleFiles.length > 0 && (
              <div>
                <p className="text-white font-semibold mb-3">{multipleFiles.length} images selected</p>
                <div className="grid grid-cols-4 gap-3 max-h-40 overflow-y-auto">
                  {multipleFiles.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="h-16 w-16 object-cover rounded-lg border-2 border-gray-600"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleMultipleUpload}
              disabled={isMultipleUploading}
              className={`w-full bg-white text-black py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 ${isMultipleUploading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                }`}
            >
              {isMultipleUploading ? 'Uploading...' : `Upload ${multipleFiles.length || ''} Images`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryUpload;