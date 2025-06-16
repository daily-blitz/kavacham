import {type MetaFunction} from 'react-router';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    {title: 'Privacy Policy | Kavacham'},
    {name: 'description', content: 'How Kavacham collects, uses, and protects your personal information. Your privacy is important to us.'},
  ];
};

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'Name, email address, shipping address, phone number when you place an order or create an account.'
        },
        {
          subtitle: 'Payment Information',
          text: 'Payment details are processed securely through our trusted payment partners (Stripe, PayPal) and are not stored on our servers.'
        },
        {
          subtitle: 'Device Information',
          text: 'Browser type, IP address, operating system, and device identifiers for analytics and security purposes.'
        },
        {
          subtitle: 'Usage Data',
          text: 'How you interact with our website, pages visited, time spent, and referral sources to improve our services.'
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Order Processing',
          text: 'To process and fulfill your orders, send confirmations, and provide shipping updates.'
        },
        {
          subtitle: 'Customer Support',
          text: 'To respond to your inquiries, provide technical support, and resolve any issues.'
        },
        {
          subtitle: 'Marketing Communications',
          text: 'To send promotional emails about new products and offers (only with your explicit consent).'
        },
        {
          subtitle: 'Service Improvement',
          text: 'To analyze usage patterns and improve our website, products, and customer experience.'
        }
      ]
    },
    {
      title: 'Data Protection & Security',
      content: [
        {
          subtitle: 'Encryption',
          text: 'All data transmission is protected with SSL encryption to ensure your information stays secure.'
        },
        {
          subtitle: 'Payment Security',
          text: 'We are PCI-compliant and use industry-standard security measures for payment processing.'
        },
        {
          subtitle: 'Access Control',
          text: 'Limited access to personal information on a need-to-know basis by authorized personnel only.'
        },
        {
          subtitle: 'Regular Audits',
          text: 'We conduct regular security audits and updates to maintain the highest protection standards.'
        }
      ]
    },
    {
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access Your Data',
          text: 'You have the right to request a copy of the personal information we hold about you.'
        },
        {
          subtitle: 'Correct Information',
          text: 'You can request corrections to any inaccurate or incomplete personal information.'
        },
        {
          subtitle: 'Delete Your Data',
          text: 'You can request deletion of your personal data, subject to legal and business requirements.'
        },
        {
          subtitle: 'Marketing Opt-out',
          text: 'You can unsubscribe from marketing communications at any time using the links in our emails.'
        }
      ]
    },
    {
      title: 'Third-Party Services',
      content: [
        {
          subtitle: 'Payment Processing',
          text: 'Stripe and PayPal for secure payment processing. They have their own privacy policies.'
        },
        {
          subtitle: 'Shipping Partners',
          text: 'USPS, FedEx, UPS for order fulfillment. They receive only necessary shipping information.'
        },
        {
          subtitle: 'Email Marketing',
          text: 'Email service providers for communications (only with your consent).'
        },
        {
          subtitle: 'Analytics',
          text: 'Google Analytics to understand website usage and improve user experience.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 opacity-70"></div>
        <motion.div 
          className="relative container-custom py-12 lg:py-16"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              How we collect, use, and protect your information
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
            <div className="bg-blue-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                At Kavacham, we take your privacy seriously. This policy explains how we collect, use, and protect 
                your personal information when you visit our website, make purchases, or interact with our services. 
                We are committed to being transparent about our data practices and giving you control over your information.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-8 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: sectionIndex * 0.1}}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={item.subtitle}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions About Our Privacy Policy?</h2>
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg text-gray-600 text-center">
              If you have any questions about how we handle your personal information or would like to exercise your rights, please don&apos;t hesitate to contact us.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@kavacham.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Privacy Team
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