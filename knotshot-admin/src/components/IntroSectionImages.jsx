import React, { useState , useEffect } from 'react';
import axios from 'axios'
const IntroSectionImages = () => {
  const [images, setImages] = useState([]);
  const [existingImages , setExistingImages] = useState([]);

  useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:8383/api/v1/intro');

                console.log("GG", response);
                setExistingImages(response.data.data.map(img => img.imageUrl));
            } catch(e) {
                console.log('there was some error')
            }
           
        }

        fetchData();
  },[])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const removeExistingImage = (index) => {
    console.log(`Remove existing image at index ${index}`);
  };

  const handleUpload = async () => {
    if (images.length === 0) return alert('No images selected!');

    const formData = new FormData();
    images.forEach((img) => {
      formData.append('images', img.file);
    });

    try{
        const response = await axios.post('http://localhost:8383/api/v1/intro/image' , formData , {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        alert('Images uploaded successfully!');
        console.log('Server Response:', response.data);
    
        setImages([]);
    } catch (e) {
        console.error(e);
        alert('Failed to upload images');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-black mb-4">Intro Section Images Upload</h1>
          <p className="text-gray-600 text-lg">Upload your website's IntroSection Images here</p>
          <p className="text-gray-400 text-center text-lg">You can upload multiple images here, we recommend minimum 4 and maximum 6</p>
        </div>

        {/* Current Images Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Current Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {existingImages.map((img, index) => (
              <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={img} 
                  alt={`Current ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                {/* <button 
                  onClick={() => removeExistingImage(index)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Remove
                </button> */}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Upload New Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black transition-colors duration-300">
              <div className="mb-6">
                <div className="w-20 h-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white rounded"></div>
                </div>
                <p className="text-gray-600 mb-2">Drop your images here or</p>
              </div>
              
              <label className="inline-block bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105">
                Choose Files
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              
              <p className="text-gray-500 text-sm mt-4">JPG, PNG, WebP up to 5MB each</p>
              <p className="text-gray-400 text-xs mt-2">Select multiple files at once</p>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">New Images Preview</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 min-h-64 border border-gray-200">
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img 
                        src={img.url} 
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-500 rounded"></div>
                  </div>
                  <p className="text-gray-500">No images selected</p>
                  <p className="text-gray-400 text-sm mt-2">Upload images to see preview</p>
                </div>
              )}
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        </div>

        {images.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg max-w-md mx-auto mb-6">
              <p className="text-green-700 font-medium mb-2">
                {images.length} new image{images.length !== 1 ? 's' : ''} ready to save
              </p>
              <p className="text-gray-600 text-sm">These will be added to your intro section</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setImages([])}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Clear All
              </button>
              <button
                onClick={handleUpload}
                className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                Save New Images
            </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroSectionImages;