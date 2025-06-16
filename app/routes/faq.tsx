import {type MetaFunction} from 'react-router';
import {motion, AnimatePresence} from 'framer-motion';
import {useState} from 'react';

export const meta: MetaFunction = () => {
  return [
    {title: 'FAQ | Kavacham'},
    {name: 'description', content: 'Frequently asked questions about Kavacham premium device skins - installation, customization, and more.'},
  ];
};

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      category: 'Product Features',
      question: 'What makes Kavacham skins different from others?',
      answer: `Our premium skins feature six key advantages:
        • Accurate Fit: Precision-cut with 0.1mm tolerance for perfect alignment
        • Zero Residue: Special adhesive removes cleanly without marks or damage
        • Unlimited Customization: Design your own or choose from our extensive gallery
        • Bubble-Free: Air-channel technology eliminates bubbles during application
        • Edge-to-Edge: Full coverage that works perfectly with cases
        • Anti-Fingerprint: Special coating resists smudges and oils`
    },
    {
      category: 'Product Features',
      question: 'How long do Kavacham skins last?',
      answer: 'With normal use, our premium skins maintain their appearance for 2-3 years. The high-quality vinyl and protective coating ensure colors stay vibrant and edges don\'t peel.'
    },
    {
      category: 'Installation',
      question: 'Is installation really bubble-free?',
      answer: 'Yes! Our air-channel adhesive design allows air to escape during application. Combined with our included installation kit and video guides, you\'ll achieve a perfect, bubble-free result every time.'
    },
    {
      category: 'Installation',
      question: 'How do I remove the skin?',
      answer: 'Simply heat the edge with a hair dryer for 15-20 seconds, then slowly peel off. The skin will come off in one piece, leaving zero residue behind.'
    },
    {
      category: 'Installation',
      question: 'Will the skin leave residue when removed?',
      answer: 'Absolutely not! Our advanced adhesive technology ensures zero residue removal. Your device will look exactly as it did before application - guaranteed.'
    },
    {
      category: 'Compatibility',
      question: 'Can I use a case with the skin?',
      answer: 'Definitely! Our skins are precisely cut to ensure compatibility with 99% of cases on the market. The edge-to-edge protection stops exactly where your case begins.'
    },
    {
      category: 'Compatibility',
      question: 'What devices do you support?',
      answer: `We currently offer skins for:
        • All iPhone models (iPhone 12 and newer)
        • Samsung Galaxy S and Note series
        • Google Pixel devices
        • MacBooks and laptops
        • Gaming consoles (PS5, Xbox, Nintendo Switch)
        • And we're constantly adding new devices!`
    },
    {
      category: 'Compatibility',
      question: 'Do the skins affect wireless charging?',
      answer: 'Not at all! Our skins are thin enough (0.3mm) to maintain full wireless charging compatibility.'
    },
    {
      category: 'Customization',
      question: 'Can I create a custom design?',
      answer: 'Yes! Our design studio lets you upload images, add text, and create completely unique skins. We also offer bulk orders for businesses and teams.'
    },
    {
      category: 'Customization',
      question: 'What file formats do you accept for custom designs?',
      answer: 'We accept high-resolution PNG, JPG, and SVG files. For best results, use images with at least 300 DPI resolution.'
    },
    {
      category: 'Ordering & Shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days (US), and express shipping takes 1-2 business days. Custom designs add 1-2 days for production.'
    },
    {
      category: 'Ordering & Shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on the destination.'
    }
  ];

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need to know about Kavacham premium skins
            </p>
          </div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Questions' : category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                transition={{duration: 0.3}}
                className="space-y-4"
              >
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3, delay: index * 0.05}}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <motion.svg
                        animate={{rotate: openIndex === index ? 180 : 0}}
                        transition={{duration: 0.3}}
                        className="w-5 h-5 text-gray-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{height: 0, opacity: 0}}
                          animate={{height: 'auto', opacity: 1}}
                          exit={{height: 0, opacity: 0}}
                          transition={{duration: 0.3}}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-gray-600 whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Can't find what you're looking for?
            </h2>
            <div className="max-w-3xl mx-auto mb-16">
              <p className="text-lg text-gray-600 text-center">
                Our support team is here to help with any questions about your Kavacham skins.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
            >
              Contact Support
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="mailto:support@kavacham.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}