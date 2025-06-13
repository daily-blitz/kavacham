import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {Hero} from '~/components/Hero';
import {CategoryCard} from '~/components/CategoryCard';
import {FeaturedProduct} from '~/components/FeaturedProduct';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [{title: 'Kavacham | Premium Mobile Accessories'}];
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
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="home">
      <Hero 
        title="Protect Your Device in Style"
        subtitle="Premium phone skins, covers, and accessories for the tech-savvy minimalist"
        ctaText="Shop Collection"
        ctaLink="/collections/all"
        image={data.featuredCollection?.image as any}
      />
      
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our range of premium mobile accessories designed for protection and style
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard 
              title="Phone Skins"
              link="/collections/phone-skins"
              image={data.featuredCollection?.image as any}
            />
            <CategoryCard 
              title="Phone Cases"
              link="/collections/phone-cases"
              image={data.featuredCollection?.image as any}
            />
            <CategoryCard 
              title="Screen Protectors"
              link="/collections/screen-protectors"
              image={data.featuredCollection?.image as any}
            />
          </div>
        </div>
      </section>
      
      <section className="section bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Trending Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular designs and latest releases
            </p>
          </motion.div>
          
          <Suspense fallback={<div className="text-center py-12">Loading trending products...</div>}>
            <Await resolve={data.recommendedProducts}>
              {(recommendedProducts) => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {recommendedProducts?.products.nodes.map((product: any, index: number) => (
                    <FeaturedProduct key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </section>
      
      <section className="section bg-black text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div 
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5}}
              >
                <h2 className="text-3xl font-bold mb-6">Why Choose Kavacham?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="mr-3 text-xl">✓</span>
                    <p>Premium materials that protect your device</p>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-xl">✓</span>
                    <p>Sleek, minimalist designs that complement your style</p>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-xl">✓</span>
                    <p>Perfect fit for all popular device models</p>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-xl">✓</span>
                    <p>Easy application and removal without residue</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/collections/all" className="btn btn-secondary">
                    Explore All Products
                  </Link>
                </div>
              </motion.div>
            </div>
            <motion.div 
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5}}
              className="relative"
            >
              {data.featuredCollection?.image && (
                <div className="rounded-lg overflow-hidden">
                  <Image
                    data={data.featuredCollection.image}
                    className="w-full h-auto"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
