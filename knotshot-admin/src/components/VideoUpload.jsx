import React, { useState, useEffect } from 'react';
import { Upload, Video, X, Play, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleVideoChange = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setUploadStatus('Please select a valid video file!');
        return;
      }
      
      // Validate file size (e.g., max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        setUploadStatus('File size too large! Please select a video under 100MB.');
        return;
      }

      setVideo(file);
      
      // Clean up previous preview URL to prevent memory leaks
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      
      const newPreviewUrl = URL.createObjectURL(file);
      setVideoPreview(newPreviewUrl);
      setUploadStatus('');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleVideoChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoChange(e.dataTransfer.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!video) {
      setUploadStatus('Please select a video first!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('Uploading...');

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadStatus('Upload successful!');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const resetForm = () => {
    setVideo(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview('');
    setUploadProgress(0);
    setUploadStatus('');
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    if (uploadStatus.includes('successful')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (uploadStatus.includes('failed') || uploadStatus.includes('large') || uploadStatus.includes('valid')) {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    } else if (uploading) {
      return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-black mb-4">
            Video Upload Center
          </h1>
          <p className="text-gray-600 text-lg mb-2">Upload your videos for Knotshots</p>
          <p className="text-gray-500 text-sm">
            Supported formats: MP4, AVI, MOV, WMV | Max size: 100MB
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white border-2 border-black rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">Upload Video</h3>
            
            {/* Drag and Drop Area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                dragActive 
                  ? 'border-black bg-gray-50' 
                  : video 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              {!video ? (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Drop your video here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Drag and drop a video file or click to select
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Video className="w-16 h-16 text-green-600 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {video.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {formatFileSize(video.size)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {video && (
              <div className="mt-6 space-y-4">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={simulateUpload}
                    disabled={uploading}
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      'Upload Video'
                    )}
                  </button>
                  
                  <button
                    onClick={resetForm}
                    disabled={uploading}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Clear
                    </span>
                  </button>
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-black h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-gray-700 text-sm font-medium">
                      {Math.round(uploadProgress)}% uploaded
                    </p>
                  </div>
                )}

                {/* Status Message */}
                {uploadStatus && (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                    uploadStatus.includes('successful') 
                      ? 'bg-green-50 border border-green-200' 
                      : uploadStatus.includes('failed') || uploadStatus.includes('large') || uploadStatus.includes('valid')
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    {getStatusIcon()}
                    <span className={`font-medium ${
                      uploadStatus.includes('successful') 
                        ? 'text-green-800' 
                        : uploadStatus.includes('failed') || uploadStatus.includes('large') || uploadStatus.includes('valid')
                        ? 'text-red-800'
                        : 'text-blue-800'
                    }`}>
                      {uploadStatus}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">Video Preview</h3>
            
            <div className="bg-white rounded-xl p-6 h-80 flex items-center justify-center">
              {videoPreview ? (
                <div className="w-full h-full relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain rounded-lg"
                    style={{ maxHeight: '100%' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                    <Play className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-600">No video selected</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Choose a video file to see the preview
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            {video && (
              <div className="mt-6 bg-gray-100 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-gray-800">Video Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p className="truncate">{video.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>
                    <p>{formatFileSize(video.size)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <p>{video.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Modified:</span>
                    <p>{new Date(video.lastModified).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;