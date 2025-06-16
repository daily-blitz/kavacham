import {type MetaFunction} from 'react-router';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    {title: 'Contact Us | Kavacham'},
    {name: 'description', content: 'Get in touch with Kavacham support team. We\'re here to help with your premium device skin questions.'},
  ];
};


export default function Contact() {
  
  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Us',
      details: 'support@kavacham.com',
      description: 'Best for general inquiries',
      link: 'mailto:support@kavacham.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM EST',
      description: 'Weekend: 10AM-4PM EST',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Response Time',
      details: 'Within 24 hours',
      description: 'Usually much faster!',
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-70"></div>
        <motion.div 
          className="relative container-custom py-12 lg:py-16"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              We're here to help with any questions about your Kavacham skins
            </p>
          </div>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 -mt-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="text-blue-600 mb-4">{method.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                {method.link ? (
                  <a href={method.link} className="text-blue-600 hover:underline font-medium">
                    {method.details}
                  </a>
                ) : (
                  <p className="text-gray-900 font-medium">{method.details}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}