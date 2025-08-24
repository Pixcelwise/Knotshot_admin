import axios from 'axios'
import React, { useEffect, useState } from 'react'

const TestimonialPreview = () => {
    const [testimony , setTestimony] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await axios.get('http://localhost:8383/api/v1/testimony')
            if(!data) return <div><p className='text-red-600'>No data available</p></div>
            console.log('data', data.data?.data)
            setTestimony(data.data?.data)
        }
        fetchData();
    },[])

    const handleDelete = async (id, publicID) => {
        const confirm = window.confirm("Are you sure you want to delete this testimonial?");
        if (!confirm) return;
      
        try {
          console.log('Deleting testimony:', id, publicID);
          
          const response = await axios.delete(`http://localhost:8383/api/v1/testimony/${id}/${encodeURIComponent(publicID)}`);
      
          setTestimony(prev => prev.filter(t => t._id !== id));
          
          alert('Testimonial deleted successfully.');
        } catch (error) {
          console.error('Error deleting testimonial:', error);
          alert('Something went wrong. Please try again.');
        }
      };
      
  return (
    <div className='mt-12'>

      <h1 className='text-4xl text-center font-bold'>Testimony Preview</h1>

      <div className='grid grid-cols-3 gap-6 mt-6'>

        {
            testimony.map(t  => {
                return (
                    <>
                   <div
                        key={t._id}
                            className="border-2 border-gray-200 py-4 px-4 rounded-2xl shadow-2xl hover:translate-y-0.5 transform transition duration-300 bg-white text-gray-800 max-w-md mx-auto"
                            >
                            <img
                                src={t.image}
                                alt=""
                                className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-300"
                            />
                                <span className="block font-semibold text-lg mb-1">Name: <span className="font-normal">{t.name}</span></span>
                                <span className="block font-semibold text-lg mb-1">Title: <span className="font-normal">{t.title}</span></span>
                                <span className="block font-semibold text-lg mb-1">Rating: <span className="text-yellow-500 font-bold">{t.rating} ⭐</span></span>
                                <span className="block font-semibold text-lg mb-1">Experience:</span>
                                <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">{t.experience}</p>

                            <button
                                onClick={() => handleDelete(t._id, t.publicId)}
                                className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md text-white font-medium w-full text-center transition-colors duration-200"
                            >
                                Delete Testimony
                            </button>
                        </div>
                    </>
                )
            })
        }
       
      </div>
    </div>
  )
}

export default TestimonialPreview
