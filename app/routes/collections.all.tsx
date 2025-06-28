import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {Pagination} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {useState, useEffect, useRef} from 'react';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `All Products | Kavacham - Premium Mobile Accessories`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const observerRef = useRef<HTMLDivElement>(null);
  const nextLinkRef = useRef<HTMLAnchorElement>(null);

  // Smooth scrolling effect
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextLinkRef.current) {
          nextLinkRef.current.click();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Filters and Controls */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-0.5">
          <div className="flex items-center justify-end gap-1">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="best-selling">Best Selling</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container-custom py-4 md:py-6">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <Pagination connection={products}>
            {({nodes, isLoading, NextLink}) => (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8" 
                  : "space-y-4"
                }>
                  {nodes.map((product, index) => (
                    <EnhancedProductItem
                      key={product.id}
                      product={product}
                      loading={index < 12 ? 'eager' : undefined}
                      viewMode={viewMode}
                      index={index}
                    />
                  ))}
                </div>
                
                {/* Infinite scroll trigger */}
                <div 
                  ref={observerRef}
                  className="flex justify-center py-8"
                >
                  <NextLink ref={nextLinkRef} className="opacity-0 pointer-events-none">
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        Loading more products...
                      </div>
                    ) : (
                      'Load more'
                    )}
                  </NextLink>
                </div>
              </>
            )}
          </Pagination>
        </motion.div>
      </section>
    </div>
  );
}

// Enhanced Product Item Component for the redesigned page
function EnhancedProductItem({
  product,
  loading,
  viewMode,
  index,
}: {
  product: any;
  loading?: 'eager' | 'lazy';
  viewMode: 'grid' | 'list';
  index: number;
}) {
  const image = product.featuredImage;
  
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{opacity: 0, x: -20}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.5, delay: index * 0.05}}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <Link 
          to={`/products/${product.handle}`}
          className="flex items-center gap-4 p-4 group"
        >
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            {image && (
              <Image
                alt={image.altText || product.title}
                aspectRatio="1/1"
                data={image}
                loading={loading}
                sizes="80px"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">{product.title}</h3>
            <div className="text-lg font-bold text-gray-900">
              <Money data={product.priceRange.minVariantPrice} />
            </div>
          </div>
          <div className="inline-flex items-center justify-center bg-white text-black border-2 border-black group-hover:bg-black group-hover:!text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex-shrink-0">
            View Details
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: index * 0.05}}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <Link 
        to={`/products/${product.handle}`}
        className="block h-full"
      >
        <div className="aspect-square relative overflow-hidden">
          {image && (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-2 sm:p-3 md:p-4 text-center">
          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center text-sm sm:text-base group-hover:text-gray-700 transition-colors">
            {product.title}
          </h3>
          <div className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
          <div className="w-full inline-flex items-center justify-center bg-white text-black border-2 border-black group-hover:bg-black group-hover:!text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-semibold transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105 text-xs sm:text-sm">
            View Product
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;