import {type MetaFunction} from 'react-router';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    {title: 'How to Apply | Kavacham'},
    {name: 'description', content: 'Step-by-step guide for perfect installation of your Kavacham premium device skin. Bubble-free application guaranteed.'},
  ];
};

export default function HowToApply() {
  const steps = [
    {
      number: "01",
      title: "Prepare Your Device",
      description: "Clean and prepare your device for the perfect application",
      items: [
        "Power off your device",
        "Remove any existing skins or cases",
        "Clean thoroughly with included alcohol wipe",
        "Wipe with microfiber cloth until spotless",
        "Use dust removal stickers for any particles"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Align Before Applying",
      description: "Practice makes perfect - get the alignment right first",
      items: [
        "Don't remove backing yet!",
        "Place skin on device to check alignment",
        "Note the key alignment points (camera, buttons, ports)",
        "Practice the placement motion",
        "Visualize where you'll start application"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Apply the Skin",
      description: "The moment of truth - slow and steady wins",
      items: [
        "Peel back only 1-2 inches of backing from top edge",
        "Align perfectly with top of device",
        "Press down the exposed edge firmly",
        "Slowly peel backing while smoothing downward",
        "Use included squeegee to push out air bubbles"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Perfect the Edges",
      description: "Secure every corner for long-lasting protection",
      items: [
        "Work from center outward to edges",
        "For curved edges, apply gentle heat with hair dryer",
        "Press and hold each edge for 10 seconds",
        "Pay special attention to corners",
        "Ensure complete adhesion around ports"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      number: "05",
      title: "Final Touches",
      description: "Complete the installation and enjoy your protected device",
      items: [
        "Run squeegee over entire surface",
        "Check all edges are fully adhered",
        "Remove any remaining tiny bubbles (they'll disappear in 24-48 hours)",
        "Power on device and test all buttons",
        "Enjoy your perfectly protected device!"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const whatYouNeed = [
    { item: "Your Kavacham skin", icon: "📱" },
    { item: "Included installation kit", icon: "🧰" },
    { item: "Hair dryer (optional, for curved edges)", icon: "💨" },
    { item: "Well-lit, dust-free environment", icon: "💡" }
  ];

  const proTips = [
    { tip: "Temperature matters", detail: "Room temperature (70-75°F) is ideal" },
    { tip: "Take your time", detail: "Rushing leads to mistakes" },
    { tip: "Start over if needed", detail: "The skin can be repositioned within first few minutes" },
    { tip: "Bubble-free guarantee", detail: "Our air-channel adhesive eliminates most bubbles automatically" }
  ];

  const mistakes = [
    "Applying in dusty environment",
    "Not cleaning device thoroughly",
    "Removing entire backing at once",
    "Stretching the skin during application",
    "Applying to wet or cold surfaces"
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
              Perfect Installation<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                in 5 Easy Steps
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Getting a flawless, bubble-free application is easier than you think!
            </p>
          </div>
        </motion.div>
      </section>

      {/* What You'll Need */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Need</h2>
            <p className="text-lg text-gray-600">Everything comes included with your Kavacham order</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {whatYouNeed.map((item, index) => (
              <motion.div
                key={item.item}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                className="bg-white rounded-xl p-6 shadow-md text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-medium text-gray-900">{item.item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Installation Guide</h2>
            <p className="text-xl text-gray-600">Follow our proven method for professional results</p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{opacity: 0, x: index % 2 === 0 ? -20 : 20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.6, delay: index * 0.2}}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full p-3">
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Step {step.number}</div>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600">{step.description}</p>
                  <ul className="space-y-3">
                    {step.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-1 mt-1">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex-1">
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl font-bold text-gray-300">{step.number}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Pro Tips</h2>
              <div className="space-y-4">
                {proTips.map((tip, index) => (
                  <div key={tip.tip} className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-1">{tip.tip}</h4>
                    <p className="text-green-700">{tip.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.2}}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
              <div className="space-y-3">
                {mistakes.map((mistake, index) => (
                  <div key={mistake} className="flex items-center gap-3 bg-red-50 rounded-lg p-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800">{mistake}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video & Support */}
      <section className="py-16 bg-gray-100">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="container-custom text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need More Help?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">📹</div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorial</h3>
              <p className="text-gray-600 mb-4">
                Scan the QR code on your installation kit for our step-by-step video guide
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Support</h3>
              <p className="text-gray-600 mb-4">
                Email us photos if you need help - we'll guide you through or send a replacement
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
              >
                Contact Support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}