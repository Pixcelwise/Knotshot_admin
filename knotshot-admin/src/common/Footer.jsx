import { Mail, Phone, Clock, AlertCircle } from 'lucide-react';

export default function ContactFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Error Header */}
        <div className="text-center mb-12 border-b border-gray-800 pb-8">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-3xl font-bold">Something Went Wrong?</h2>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We're here to help! If you encountered an error or need assistance, 
            please reach out to us using any of the methods below.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Email Support */}
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-white text-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-400 mb-3">Get help via email</p>
            <a 
              href="mailto:support@company.com" 
              className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
            >
              pixcelwise@gmail.com
            </a>
            <br />
            
          </div>

          {/* Phone Support */}
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-white text-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-400 mb-3">Call us directly</p>
            <a 
              href="tel:+1234567890" 
              className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
            >
              +91 
            </a>
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Support Hours</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-300 mb-1">Monday - Friday</p>
              <p className="text-white font-semibold">9:00 AM - 6:00 PM PST</p>
            </div>
            <div>
              <p className="text-gray-300 mb-1">Weekend</p>
              <p className="text-white font-semibold">10:00 AM - 4:00 PM PST</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center border-t border-gray-800 pt-8">
          <p className="text-gray-400 mb-2">
            We typically respond within 2-4 hours during business hours
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 <span className='text-purple-500'>PixcelWise</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}