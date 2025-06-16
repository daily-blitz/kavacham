import {type MetaFunction} from 'react-router';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    {title: 'Returns & Quality Guarantee | Kavacham'},
    {name: 'description', content: '30-day perfect fit guarantee. Quality assurance on all Kavacham premium device skins with instant replacement.'},
  ];
};

export default function Returns() {
  const guaranteeFeatures = [
    {
      title: 'Perfect Fit Promise',
      description: 'If the skin doesn\'t align perfectly, we\'ll replace it',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Design Satisfaction',
      description: 'Not happy with your custom design? We\'ll recreate it',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      title: 'Unused Products',
      description: 'Full refund on unopened products within 30 days',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Quality Issues',
      description: 'Store credit for used skins with quality problems',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const replacementReasons = [
    'Skin doesn\'t fit accurately (alignment issues)',
    'Printing defects or color issues',
    'Adhesive problems within first 30 days',
    'Damage during shipping'
  ];

  const notCovered = [
    'Customer installation errors',
    'Normal wear after 6 months',
    'Custom designs with customer-provided low-resolution images',
    'Removal and reapplication attempts'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-70"></div>
        <motion.div 
          className="relative container-custom py-12 lg:py-16"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Returns & Quality Guarantee
            </h1>
            <p className="text-xl text-gray-600">
              We stand behind every skin with our comprehensive quality promise
            </p>
            <div className="mt-8 inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30-Day Perfect Fit Guarantee
            </div>
          </div>
        </motion.div>
      </section>

      {/* Guarantee Features */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Promise to You</h2>
            <p className="text-lg text-gray-600">If your Kavacham skin doesn't meet our high standards, we'll make it right</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guaranteeFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Return</h2>
            <p className="text-lg text-gray-600">Simple 4-step process for returns and exchanges</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {[
                { step: '01', title: 'Email Us', description: 'Send photos and your order number to support@kavacham.com' },
                { step: '02', title: 'Get Assessment', description: 'We\'ll determine if you need a replacement or refund' },
                { step: '03', title: 'Ship Back (if needed)', description: 'For refunds, we\'ll provide a prepaid return label' },
                { step: '04', title: 'Receive Resolution', description: 'Refunds processed within 5-7 business days' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.5, delay: index * 0.1}}
                  className="bg-white rounded-xl p-6 shadow-md flex items-center gap-6"
                >
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Guarantee Details */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6}}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">We Replace For Free If:</h2>
              <div className="space-y-4">
                {replacementReasons.map((reason, index) => (
                  <div key={reason} className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
                    <div className="bg-green-100 rounded-full p-1 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-green-800">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.2}}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Not Covered:</h2>
              <div className="space-y-4">
                {notCovered.map((item, index) => (
                  <div key={item} className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instant Replacement */}
      <section className="py-16 bg-gray-100">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="container-custom"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Instant Replacement Process</h2>
            <div className="max-w-3xl mx-auto mb-16">
              <p className="text-lg text-gray-600 text-center">
                Quality issues? We&apos;ll ship a replacement within 24 hours - no need to return the defective skin first.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Custom Design Policy</h3>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li>• We'll work with you to perfect your custom design</li>
                    <li>• Up to 2 free revisions before printing</li>
                    <li>• Color matching available for corporate orders</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Final Promise</h3>
                  <p className="text-gray-600 text-left">
                    Every skin meets our strict quality standards. If it's not perfect, we'll replace it - no questions asked.
                  </p>
                  <div className="mt-6">
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
                    >
                      Start a Return
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}