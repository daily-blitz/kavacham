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

// Helper function to parse rich text description
function parseRichTextDescription(richTextValue: string) {
  try {
    const parsed = JSON.parse(richTextValue);
    if (parsed?.children) {
      return parsed.children.map((child: any) => {
        if (child.type === 'paragraph' && child.children) {
          return child.children.map((textNode: any) => ({
            text: textNode.value || '',
            bold: textNode.bold || false
          }));
        }
        return [];
      }).flat();
    }
  } catch (e) {
    // If parsing fails, return the original value as plain text
    return [{ text: richTextValue, bold: false }];
  }
  return [];
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  
  // Transform metaobjects into hero slides
  const heroSlides = data.heroMetaobjects?.map((edge: any) => {
    const metaobject = edge.node;
    const fields = metaobject.fields;
    
    // Extract field values
    const title = fields.find((f: any) => f.key === 'title')?.value || '';
    const descriptionField = fields.find((f: any) => f.key === 'description')?.value || '';
    const imageField = fields.find((f: any) => f.key === 'image_url');
    const ctaText = fields.find((f: any) => f.key === 'cta_text')?.value;
    const ctaLink = fields.find((f: any) => f.key === 'cta_link')?.value || '/collections/all';
    
    // Parse rich text description
    const parsedDescription = parseRichTextDescription(descriptionField);
    
    return {
      id: metaobject.id,
      title,
      subtitle: parsedDescription,
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
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <HeroGallery 
          slides={heroSlides}
          autoPlay={true}
          autoPlayInterval={5000}
          overlay={true}
        />
      </div>
      
      <section className="section bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <motion.div 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="flex flex-col items-center text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Discover Your Perfect Match
            </h2>
            <div className="w-full max-w-4xl px-4">
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed text-center">
                Browse our expertly curated categories to find exactly what your device needs. From sleek protection to stylish customization, we&apos;ve organized everything to make your shopping effortless.
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.categories?.sort((a: any, b: any) => {
              const countA = a.products?.nodes?.length || 0;
              const countB = b.products?.nodes?.length || 0;
              return countB - countA; // Sort descending (more products first)
            }).map((category: any, index: number) => (
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
            className="flex flex-col items-center text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              What&apos;s Hot Right Now
            </h2>
            <div className="w-full max-w-4xl px-4">
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed text-center">
                Discover the most loved products by our community. These trending items combine style, functionality, and innovation to keep your device looking fresh and protected.
              </p>
            </div>
          </motion.div>
          
          <Suspense fallback={<div className="text-center py-12">Loading trending products...</div>}>
            <Await resolve={data.recommendedProducts}>
              {(recommendedProducts) => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {recommendedProducts?.products.nodes.slice(0, 8).map((product: any, index: number) => (
                    <FeaturedProduct key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </section>

      {/* Self Healing Scratch Protection Section */}

      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, #85969C 0%, #EFA29D 50%, #929693 100%)',
            opacity: 1
          }}
        />
        <div className="container-custom relative z-[1]">
          <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-8 md:p-12">
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-medium text-white mb-2 drop-shadow-lg">
                Self Healing Scratch Protection May Not Be Something You Need,
              </h2>
              <h3 className="text-2xl md:text-3xl font-medium text-white drop-shadow-lg">
                But Definitely Something You Deserve.
              </h3>
            </motion.div>
            
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              <motion.div 
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1}}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 md:p-6 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <div className="relative h-12 w-12 md:h-20 md:w-20 mx-auto mb-2 md:mb-4 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img 
                    src="/assets/accurate_fit_kavacham.png" 
                    alt="Accurate Fit"
                    className="w-full h-full object-contain p-2 md:p-3 filter brightness-0 invert transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                <h4 className="text-xs md:text-xl font-semibold text-white transition-colors duration-300 leading-tight">Accurate Fit</h4>
              </motion.div>
            
              <motion.div 
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.2}}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 md:p-6 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <div className="relative h-12 w-12 md:h-20 md:w-20 mx-auto mb-2 md:mb-4 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img 
                    src="/assets/no_residue_kavacham.png" 
                    alt="Zero Residue Removal"
                    className="w-full h-full object-contain p-2 md:p-3 filter brightness-0 invert transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                <h4 className="text-xs md:text-xl font-semibold text-white transition-colors duration-300 leading-tight">Zero Residue Removal</h4>
              </motion.div>
            
              <motion.div 
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.3}}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 md:p-6 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <div className="relative h-12 w-12 md:h-20 md:w-20 mx-auto mb-2 md:mb-4 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img 
                    src="/assets/customisation_kavacham.png" 
                    alt="Unlimited Customization"
                    className="w-full h-full object-contain p-2 md:p-3 filter brightness-0 invert transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                <h4 className="text-xs md:text-xl font-semibold text-white transition-colors duration-300 leading-tight">Unlimited Customization</h4>
              </motion.div>
            
              <motion.div 
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.4}}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 md:p-6 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <div className="relative h-12 w-12 md:h-20 md:w-20 mx-auto mb-2 md:mb-4 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img 
                    src="/assets/bubble_free_kavacham.png" 
                    alt="Bubble-Free"
                    className="w-full h-full object-contain p-2 md:p-3 filter brightness-0 invert transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                <h4 className="text-xs md:text-xl font-semibold text-white transition-colors duration-300 leading-tight">Bubble-Free</h4>
              </motion.div>
            
              <motion.div 
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.5}}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 md:p-6 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <div className="relative h-12 w-12 md:h-20 md:w-20 mx-auto mb-2 md:mb-4 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img 
                    src="/assets/edge_toedge_kavacham.png" 
                    alt="Edge to Edge Protection"
                    className="w-full h-full object-contain p-2 md:p-3 filter brightness-0 invert transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                <h4 className="text-xs md:text-xl font-semibold text-white transition-colors duration-300 leading-tight">Edge to Edge Protection</h4>
              </motion.div>
            
              <motion.div 
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.6}}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 md:p-6 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <div className="relative h-12 w-12 md:h-20 md:w-20 mx-auto mb-2 md:mb-4 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img 
                    src="/assets/reduced_fingerprint_kavacham.png" 
                    alt="Reduced Fingerprints"
                    className="w-full h-full object-contain p-2 md:p-3 filter brightness-0 invert transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                <h4 className="text-xs md:text-xl font-semibold text-white transition-colors duration-300 leading-tight">Reduced Fingerprints</h4>
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
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
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
    products(first: 250) {
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
