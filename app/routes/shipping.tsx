import {type MetaFunction} from 'react-router';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    {title: 'Shipping Information | Kavacham'},
    {name: 'description', content: 'Free shipping on orders over $30. Fast delivery of your premium Kavacham device skins worldwide.'},
  ];
};

export default function Shipping() {

  const included = [
    'Your premium Kavacham skin(s)',
    'Installation kit (squeegee, cleaning cloth, dust stickers)',
    'Detailed installation guide with QR code for video tutorial',
    'Spare alignment stickers'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-70"></div>
        <motion.div 
          className="relative container-custom py-12 lg:py-16"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Shipping Information
            </h1>
            <p className="text-xl text-gray-600">
              Fast, secure delivery of your premium device skins
            </p>
          </div>
        </motion.div>
      </section>

      {/* Order Processing */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6}}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Order Processing</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Same Day Shipping</h4>
                    <p className="text-gray-600">Standard designs ship same day if ordered before 2 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Custom Design Processing</h4>
                    <p className="text-gray-600">Custom designs require 24-48 hours for production</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Quality Checked</h4>
                    <p className="text-gray-600">All skins are quality-checked before shipping</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.2}}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                  {included.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="py-16 bg-gray-100">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="container-custom text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Track Your Order</h2>
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg text-gray-600 text-center">
              You&apos;ll receive tracking information as soon as your order ships. Custom design customers receive an additional email when production begins.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
            >
              Track Your Order
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
            >
              Need Help?
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}