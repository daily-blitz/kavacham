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
import {HeroGallery} from '~/components/HeroGallery';
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
  const [{collections}, {metaobjects}, {collections: categories}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HERO_GALLERY_QUERY),
    context.storefront.query(CATEGORIES_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
    heroMetaobjects: metaobjects.edges,
    categories: categories.nodes,
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
  
  // Transform metaobjects into hero slides
  const heroSlides = data.heroMetaobjects?.map((edge: any) => {
    const metaobject = edge.node;
    const fields = metaobject.fields;
    
    // Extract field values
    const title = fields.find((f: any) => f.key === 'title')?.value || '';
    const description = fields.find((f: any) => f.key === 'description')?.value || '';
    const imageField = fields.find((f: any) => f.key === 'image_url');
    const ctaText = fields.find((f: any) => f.key === 'cta_text')?.value || 'Shop Now';
    const ctaLink = fields.find((f: any) => f.key === 'cta_link')?.value || '/products';
    
    return {
      id: metaobject.id,
      title,
      subtitle: description,
      ctaText,
      ctaLink,
      image: imageField?.reference?.image || null,
    };
  }) || [];

  // Fallback slide if no metaobjects are available
  if (heroSlides.length === 0) {
    heroSlides.push({
      id: 'fallback',
      title: "Protect Your Device in Style",
      subtitle: "Premium phone skins, covers, and accessories for the tech-savvy minimalist",
      ctaText: "Shop Now",
      ctaLink: "/products",
      image: data.featuredCollection?.image,
    });
  }
  
  return (
    <div className="home">
      <HeroGallery 
        slides={heroSlides}
        autoPlay={true}
        autoPlayInterval={5000}
        overlay={true}
      />
      
      <section className="section bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <motion.div 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our curated collections of premium mobile accessories
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.categories?.map((category: any, index: number) => (
              <CategoryCard 
                key={category.id}
                title={category.title}
                description={category.description}
                link={`/collections/${category.handle}`}
                image={category.image}
                productCount={category.products?.nodes?.length || 0}
                index={index}
              />
            ))}
          </div>
          
          {data.categories?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories available at the moment.</p>
            </div>
          )}
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
      
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, #85969C 0%, #EFA29D 50%, #929693 100%)',
            opacity: 0.9
          }}
        />
        <div className="container-custom relative z-10">
          <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-8 md:p-12">
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
                Self Healing Scratch Protection May Not Be Something You Need,
              </h2>
              <h3 className="text-2xl md:text-3xl font-light text-white">
                But Definitely Something You Deserve.
              </h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.1}}
              className="flex items-center text-white"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h4 className="text-xl font-medium">Accurate Fit</h4>
            </motion.div>
            
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2}}
              className="flex items-center text-white"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-medium">Zero Residue Removal</h4>
            </motion.div>
            
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.3}}
              className="flex items-center text-white"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h4 className="text-xl font-medium">Unlimited Customization</h4>
            </motion.div>
            
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.4}}
              className="flex items-center text-white"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-xl font-medium">Bubble-Free</h4>
            </motion.div>
            
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.5}}
              className="flex items-center text-white"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-medium">Edge to Edge Protection</h4>
            </motion.div>
            
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.6}}
              className="flex items-center text-white"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h4 className="text-xl font-medium">Reduced Fingerprints</h4>
            </motion.div>
          </div>
          </div>
        </div>
      </section>
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

const HERO_GALLERY_QUERY = `#graphql
  query HeroGallery($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobjects(type: "hero_banner", first: 10) {
      edges {
        node {
          id
          fields {
            key
            value
            type
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
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

const CATEGORIES_QUERY = `#graphql
  fragment CategoryCollection on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 1) {
      nodes {
        id
      }
    }
  }
  query CategoriesQuery($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 9, sortKey: TITLE) {
      nodes {
        ...CategoryCollection
      }
    }
  }
` as const;
