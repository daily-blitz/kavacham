import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from 'react-router';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    {title: 'Pages | Kavacham'},
    {name: 'description', content: 'Explore our policies, FAQs, and company information'},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {pages} = await context.storefront.query(PAGES_QUERY, {
    variables: {
      first: 20, // Adjust based on your needs
    },
  });

  return {pages};
}

export default function PagesIndex() {
  const {pages} = useLoaderData<typeof loader>();

  const pageCategories = {
    'Customer Service': ['faq', 'contact', 'shipping', 'returns'],
    'About': ['about-us', 'our-story', 'mission'],
    'Legal': ['privacy-policy', 'terms-of-service', 'refund-policy'],
  };

  const categorizePages = () => {
    const categorized: Record<string, typeof pages.nodes> = {};
    const uncategorized: typeof pages.nodes = [];

    pages.nodes.forEach((page) => {
      let added = false;
      for (const [category, handles] of Object.entries(pageCategories)) {
        if (handles.some(handle => page.handle.includes(handle))) {
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(page);
          added = true;
          break;
        }
      }
      if (!added) uncategorized.push(page);
    });

    return {categorized, uncategorized};
  };

  const {categorized, uncategorized} = categorizePages();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
    >
      <div className="container-custom py-12 lg:py-16">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 0.1}}
          className="max-w-6xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Information Center
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to your questions and learn more about Kavacham
            </p>
          </div>

          {/* Categorized Pages */}
          {Object.entries(categorized).map(([category, categoryPages], categoryIndex) => (
            <motion.div
              key={category}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2 + categoryIndex * 0.1}}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/pages/${page.handle}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      <svg 
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors mt-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {page.bodySummary && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {page.bodySummary}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Uncategorized Pages */}
          {uncategorized.length > 0 && (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.5}}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Other Information</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uncategorized.map((page) => (
                  <Link
                    key={page.id}
                    to={`/pages/${page.handle}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      <svg 
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors mt-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {page.bodySummary && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {page.bodySummary}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.6}}
            className="mt-16 bg-gray-100 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pages/contact"
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Contact Us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/pages/faq"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 hover:border-gray-400 transition-colors"
              >
                View FAQs
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const PAGES_QUERY = `#graphql
  query Pages($first: Int!) {
    pages(first: $first) {
      nodes {
        id
        title
        handle
        bodySummary
        createdAt
        updatedAt
      }
    }
  }
` as const;