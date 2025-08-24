import React, { useState } from 'react'
import { Star, Upload, X } from 'lucide-react'
import axios from 'axios'
import TestimonialPreview from './Previews/TestimonialPreview'

const Testimonial = () => {
    const [name, setName] = useState('')
    const [experience, setExperience] = useState('')
    const [rating, setRating] = useState(0)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [image, setImage] = useState(null)
    const [title, setTitle] = useState('')
    const [previewUrl, setPreviewUrl] = useState(null)

    const handleStarClick = (starIndex) => {
        setRating(starIndex)
    }

    const handleStarHover = (starIndex) => {
        setHoveredStar(starIndex)
    }

    const handleStarLeave = () => {
        setHoveredStar(0)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setImage(null)
        setPreviewUrl(null)
    }

    const handleSubmit = async () => {
        if (!name || !experience || !title || !rating || !image) {
          alert('Please fill in all required fields!');
          return;
        }
      
        const confirm = window.confirm("Are you sure you want to submit this testimonial?");
        if (!confirm) return;
      
        const formData = new FormData();
        formData.append('name', name);
        formData.append('experience', experience);
        formData.append('title', title);
        formData.append('rating', rating);
        formData.append('file', image);
      
        try {
          const response = await axios.post('http://localhost:8383/api/v1/testimony/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          alert('Testimonial submitted successfully!');
          console.log('Success:', response.data);
      
          // Optional: Reset form
          setName('');
          setExperience('');
          setTitle('');
          setRating(0);
          setImage(null);
          setPreviewUrl(null);
        } catch (error) {
          console.error('Upload failed:', error);
          alert('Something went wrong. Please try again.');
        }
      };
      
    return (
        <div className='min-h-screen bg-white py-24 px-4'>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-black mb-4">
                        Testimonial Upload
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Upload your website's testimonial content here
                    </p>
                </div>

                <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-xl">
                   
                    <div className='mb-8'>
                        <label htmlFor="title" className="block text-black font-semibold text-lg mb-3">
                            PhotoShoot Domain <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id='title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-full p-4 border-2 border-gray-300 rounded-xl text-black bg-white focus:border-black focus:outline-none transition-colors duration-200 text-lg'
                            placeholder='What kind of photoshoot? (e.g., Wedding, Portrait, Event)'
                            required
                        />
                    </div>

                   
                    <div className="mb-8">
                        <label htmlFor="name" className="block text-black font-semibold text-lg mb-3">
                            Client's Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full p-4 border-2 border-gray-300 rounded-xl text-black bg-white focus:border-black focus:outline-none transition-colors duration-200 text-lg'
                            placeholder="Enter client's full name"
                            required
                        />
                    </div>

                   
                    <div className="mb-8">
                        <label htmlFor="experience" className="block text-black font-semibold text-lg mb-3">
                            Client's Experience <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            id='experience'
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className='w-full p-4 border-2 border-gray-300 rounded-xl text-black bg-white focus:border-black focus:outline-none transition-colors duration-200 text-lg resize-none'
                            rows="6"
                            placeholder="Share the client's experience and feedback..."
                            required
                        />
                    </div>

                    
                    <div className='mb-8'>
                        <label htmlFor="image" className="block text-black font-semibold text-lg mb-3">
                            Reference Image  <span className="text-red-500">*</span>
                        </label>
                        
                        {!previewUrl ? (
                            <div className="relative">
                                <input 
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    required
                                />
                                <label 
                                    htmlFor="image"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-black transition-colors duration-200 bg-gray-50"
                                >
                                    <Upload size={32} className="text-gray-400 mb-2" />
                                    <p className="text-gray-500 text-center">
                                        Click to upload an image
                                        <br />
                                        <span className="text-sm">PNG, JPG, GIF up to 10MB</span>
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative inline-block">
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="w-48 h-48 object-cover rounded-xl border-2 border-gray-300" 
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                   
                    <div className="mb-8">
                        <label className="block text-black font-semibold text-lg mb-3">
                            Client's Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => handleStarHover(star)}
                                    onMouseLeave={handleStarLeave}
                                    className="transition-transform duration-150 hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={40}
                                        className={`${
                                            star <= (hoveredStar || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'fill-gray-200 text-gray-300'
                                        } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="mt-2 text-gray-600">
                                Rating: {rating} out of 5 stars
                            </p>
                        )}
                        {rating === 0 && (
                            <p className="mt-2 text-red-500 text-sm">
                                Please select a rating
                            </p>
                        )}
                    </div>

                   
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-black text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Testimonial
                    </button>
                </div>

                <div>
                  
                    <TestimonialPreview/>
                </div>
               
            </div>
        </div>
    )
}

export default Testimonial