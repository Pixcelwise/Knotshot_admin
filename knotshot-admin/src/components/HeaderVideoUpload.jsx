import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HeaderVideoUpload = () => {
  const [existingVideo, setExistingVideo] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get('http://localhost:8383/api/v1/landing');
        console.log(response);
  
        // Correct property name: videoUrl (not videoURL)
        setExistingVideo(response.data.data.videoUrl);
      } catch (e) {
        console.error('Error fetching header video:', e);
      }
    };
  
    fetchVideo();
  }, []);
  
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoURL(URL.createObjectURL(file));
      setSelectedVideo(file);
    }
  };

  const handleupload = async () => {
    if (!selectedVideo) return alert('No video selected!');

    const formData = new FormData();
    formData.append('video', selectedVideo);

    try {
      const response = await axios.post(
        'http://localhost:8383/api/v1/landing/upload-header-video',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('Video uploaded successfully!');
      console.log('Server Response:', response.data);

      // Reset preview and update existing video
      setVideoURL(null);
      setSelectedVideo(null);
      setExistingVideo(response.data.data?.secure_url || response.data.data?.videoURL);
    } catch (e) {
      console.error(e);
      alert('Failed to upload video');
    }
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-black mb-4">Header Video Upload</h1>
          <p className="text-gray-600 text-lg">Upload your website's main header video</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Current Video Section */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Current Header Video</h2>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              {existingVideo ? (
                <video
                  controls
                  src={existingVideo}
                  className="w-full max-h-64 rounded-lg shadow-md mb-4"
                />
              ) : (
                <p className="text-gray-500 text-center">No header video available</p>
              )}
              {/* Remove button can be linked to delete functionality */}
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Upload Video</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black transition-colors duration-300">
              <div className="mb-6">
                <div className="w-20 h-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                </div>
                <p className="text-gray-600 mb-2">Drop your video here or</p>
              </div>

              <label className="inline-block bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105">
                Choose File
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>

              <p className="text-gray-500 text-sm mt-4">MP4, WebM, AVI up to 50MB</p>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Preview</h2>

            <div className="bg-gray-50 rounded-xl p-6 min-h-64 flex items-center justify-center border border-gray-200">
              {videoURL ? (
                <video
                  controls
                  src={videoURL}
                  className="w-full max-h-80 rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-500 rounded"></div>
                  </div>
                  <p className="text-gray-500">No video selected</p>
                  <p className="text-gray-400 text-sm mt-2">Upload a video to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {videoURL && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg max-w-md mx-auto mb-6">
              <p className="text-green-700 font-medium mb-2">New video ready to save</p>
              <p className="text-gray-600 text-sm">This will replace your current header video</p>
            </div>
            <button
              onClick={handleupload}
              className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Save New Header Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderVideoUpload;
