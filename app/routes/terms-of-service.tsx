import {type MetaFunction} from 'react-router';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    {title: 'Terms of Service | Kavacham'},
    {name: 'description', content: 'Terms and conditions for using Kavacham services and purchasing premium device skins.'},
  ];
};

export default function TermsOfService() {
  const sections = [
    {
      title: 'Agreement to Terms',
      content: 'By accessing and using kavacham.com, placing orders, or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.'
    },
    {
      title: 'Products and Services',
      subsections: [
        {
          subtitle: 'Product Descriptions',
          text: 'We strive to provide accurate descriptions and images of our premium device skins. However, colors may vary slightly due to monitor settings and lighting conditions.'
        },
        {
          subtitle: 'Pricing',
          text: 'All prices are listed in USD unless otherwise stated. We reserve the right to modify prices at any time without prior notice.'
        },
        {
          subtitle: 'Availability',
          text: 'Product availability is subject to change. We will notify you if any item in your order becomes unavailable.'
        },
        {
          subtitle: 'Custom Designs',
          text: 'Custom design services are subject to our design guidelines and approval process. We reserve the right to refuse designs that violate our content policy.'
        }
      ]
    },
    {
      title: 'Orders and Payment',
      subsections: [
        {
          subtitle: 'Age Requirement',
          text: 'You must be at least 18 years old to place an order. By placing an order, you represent that you meet this requirement.'
        },
        {
          subtitle: 'Order Accuracy',
          text: 'You are responsible for providing accurate billing and shipping information. We are not responsible for delays caused by incorrect information.'
        },
        {
          subtitle: 'Payment Terms',
          text: 'Payment is due in full at the time of order. We accept major credit cards and PayPal through our secure payment processors.'
        },
        {
          subtitle: 'Order Cancellation',
          text: 'We reserve the right to cancel orders that appear fraudulent, suspicious, or violate these terms.'
        }
      ]
    },
    {
      title: 'Shipping and Delivery',
      subsections: [
        {
          subtitle: 'Shipping Times',
          text: 'Estimated delivery times are not guaranteed and may vary due to processing time, shipping method, and destination.'
        },
        {
          subtitle: 'Risk of Loss',
          text: 'Risk of loss and title pass to you upon delivery to the shipping carrier.'
        },
        {
          subtitle: 'International Orders',
          text: 'International customers may be responsible for customs duties, taxes, and other fees imposed by their country.'
        }
      ]
    },
    {
      title: 'Returns and Warranties',
      subsections: [
        {
          subtitle: 'Return Policy',
          text: 'Our return policy is detailed on our Returns page. Returns must be initiated within 30 days of delivery.'
        },
        {
          subtitle: 'Warranty Disclaimer',
          text: 'Our products are provided "as is" without warranty except as specifically stated in our Quality Guarantee.'
        },
        {
          subtitle: 'Limitation of Liability',
          text: 'Kavacham\'s liability is limited to the purchase price of the product. We are not responsible for indirect, incidental, or consequential damages.'
        }
      ]
    },
    {
      title: 'Intellectual Property',
      subsections: [
        {
          subtitle: 'Our Content',
          text: 'All content on this website, including text, images, logos, and design elements, is the property of Kavacham and protected by copyright and trademark laws.'
        },
        {
          subtitle: 'User Content',
          text: 'By submitting custom designs or reviews, you grant us a non-exclusive license to use this content for business purposes.'
        },
        {
          subtitle: 'Third-Party Rights',
          text: 'You are responsible for ensuring that any custom designs do not infringe on third-party intellectual property rights.'
        }
      ]
    },
    {
      title: 'User Conduct',
      subsections: [
        {
          subtitle: 'Prohibited Uses',
          text: 'You may not use our website for any illegal purpose or to violate any laws. You may not attempt to interfere with our website\'s operation.'
        },
        {
          subtitle: 'Content Guidelines',
          text: 'Custom designs must not contain offensive, inappropriate, or copyrighted content. We reserve the right to refuse any design.'
        }
      ]
    },
    {
      title: 'Privacy',
      content: 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.'
    },
    {
      title: 'Governing Law',
      content: 'These terms are governed by and construed in accordance with the laws of the United States. Any disputes will be resolved in the courts of our jurisdiction.'
    },
    {
      title: 'Changes to Terms',
      content: 'We may update these terms at any time. Continued use of our website after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or website notice.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-gray-100 opacity-70"></div>
        <motion.div 
          className="relative container-custom py-12 lg:py-16"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Terms and conditions for using Kavacham services
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container-custom">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.1}}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-purple-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Kavacham</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service govern your use of our website and services. By using Kavacham, you agree to these terms. 
                Please read them carefully as they contain important information about your rights and obligations, 
                as well as limitations and exclusions that may apply to you.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-8 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: sectionIndex * 0.1}}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                
                {section.content && (
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                )}
                
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subsection.subtitle}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{subsection.subtitle}</h3>
                        <p className="text-gray-600 leading-relaxed">{subsection.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="container-custom text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions About These Terms?</h2>
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg text-gray-600 text-center">
              If you have any questions about these Terms of Service or need clarification on any aspect of our policies, please contact us.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@kavacham.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Legal Team
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}