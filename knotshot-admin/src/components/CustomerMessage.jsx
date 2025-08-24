import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Mail, User, DollarSign, Calendar, MessageSquare } from 'lucide-react';

const CustomerMessage = () => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8383/api/v1/form/get-contact-form-data');
        console.log('Fetched data:', res.data.data);
        setCustomerData(res.data.data || []);
      } catch (e) {
        console.error('Something went wrong:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      
      const res = await axios.delete(`http://localhost:8383/api/v1/form/delete-message/${id}`);
      console.log('Deleted:', res.data.data);
  
     
      setCustomerData((prevData) =>
        prevData.filter((msg) => msg._id !== id)
      );
  
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  

  return (
    <div className="min-h-screen  text-white">
      {/* Header Section */}
      <div className="bg-white text-black py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            Customer Messages
          </h1>
          <p className="text-gray-600 text-xl font-medium">
            Manage and respond to your customer inquiries
          </p>
          <div className="mt-8 h-1 w-24 bg-black mx-auto"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-gray-400 text-lg">Loading customer messages...</p>
          </div>
        ) : customerData.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-xl">No customer messages found.</p>
            <p className="text-gray-600 mt-2">New messages will appear here when customers contact you.</p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-8 bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Messages</h3>
                  <p className="text-3xl font-bold text-white">{customerData.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Messages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {customerData.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-white text-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gray-300"
                >
                  {/* Card Header */}
                  <div className="bg-black text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <h3 className="font-bold text-lg">
                          {msg.name || 'Anonymous'}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-2 hover:bg-red-600 rounded-full transition-colors duration-200 group"
                        title="Delete message"
                      >
                        <Trash2 className="h-4 w-4 text-red-400 group-hover:text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Event Type */}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Event Type:</span>
                      <span className="bg-black text-white px-2 py-1 rounded text-sm font-semibold">
                        {msg.EventType}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-black hover:text-gray-600 font-medium underline decoration-2 underline-offset-2"
                      >
                        {msg.email}
                      </a>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Budget:</span>
                      <span className="font-semibold text-green-600">
                        {msg.Budget}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Message:</span>
                          <p className="text-gray-800 leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-6 py-3 border-t">
                    <button
                      onClick={() => window.location.href = `mailto:${msg.email}`}
                      className="w-full bg-black text-white py-2 px-4 rounded font-semibold hover:bg-gray-800 transition-colors duration-200"
                    >
                      Reply to Customer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

};

export default CustomerMessage;
