import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, Link} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {DeviceSelector} from '~/components/DeviceSelector';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {motion} from 'framer-motion';
import {useState, Suspense} from 'react';
import {Await} from 'react-router';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.product.title ?? ''} | Kavacham`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) return {};

  // Load product recommendations
  const productRecommendations = storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      variables: {handle},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    productRecommendations,
  };
}

export default function Product() {
  const {product, productRecommendations} = useLoaderData<typeof loader>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // State for device selection and custom image
  const [selectedDevice, setSelectedDevice] = useState<{
    brand: string;
    model: string;
    image?: string;
  }>({ brand: '', model: '' });

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, metafields, tags, featuredImage, images, vendor} = product;
  const hasMultipleImages = images?.edges?.length > 1;

  // Handle device selection change
  const handleDeviceSelection = (brand: string, model: string, modelImage?: string) => {
    setSelectedDevice({ brand, model, image: modelImage });
  };

  // Determine which image to display
  const displayImage = selectedDevice.image 
    ? { 
        __typename: 'Image' as const,
        url: selectedDevice.image, 
        altText: `${title} for ${selectedDevice.brand} ${selectedDevice.model}`, 
        width: 800, 
        height: 800, 
        id: 'device-showcase' 
      }
    : selectedVariant?.image;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
    >
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            <motion.div
              className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden cursor-zoom-in"
              key={displayImage?.id || selectedVariant?.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowImageModal(true)}
            >
              <ProductImage image={displayImage || images?.edges?.[activeImageIndex]?.node} />
              {selectedVariant?.compareAtPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Sale
                </div>
              )}
            </motion.div>
            
            {selectedDevice.image && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-gray-600"
              >
                Showing case for {selectedDevice.brand} {selectedDevice.model}
              </motion.div>
            )}
            
            {/* Image Thumbnails */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.edges.map((edge: any, index: number) => (
                  <button
                    key={edge.node.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === activeImageIndex ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      data={edge.node}
                      aspectRatio="1/1"
                      sizes="(min-width: 640px) 100px, 80px"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2}}
            >
              {/* Product Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
                </div>
                {vendor && (
                  <p className="text-gray-600 mb-2">by <span className="font-medium">{vendor}</span></p>
                )}
                <div className="flex items-baseline gap-3">
                  <ProductPrice
                    price={selectedVariant?.price}
                    compareAtPrice={selectedVariant?.compareAtPrice}
                  />
                  {selectedVariant?.compareAtPrice && (
                    <span className="text-sm text-green-600 font-medium">
                      Save {Math.round(((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) / parseFloat(selectedVariant.compareAtPrice.amount)) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Product Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="prose prose-gray prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{__html: descriptionHtml}} />
              </div>
              
              {/* Key Features */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Self-Healing Technology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Easy Installation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Lifetime Warranty</span>
                  </div>
                </div>
              </div>
              
              {/* Device Selector */}
              <DeviceSelector
                metafields={metafields || []}
                onSelectionChange={handleDeviceSelection}
                className="mb-6"
              />
              
              {/* Product Form */}
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                selectedDevice={selectedDevice}
              />
              
              {/* Shipping Info */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $50. Ships within 2-3 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-600">30-day return policy. No questions asked.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products Section */}
        <Suspense fallback={<div className="mt-16 text-center">Loading recommendations...</div>}>
          <Await resolve={productRecommendations}>
            {(response) => {
              const recommendations = response?.productRecommendations || [];
              if (recommendations.length === 0) return null;
              
              return (
                <motion.section 
                  className="mt-16 border-t pt-16"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.5, delay: 0.4}}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {recommendations.slice(0, 4).map((product: any) => (
                      <Link 
                        key={product.id} 
                        to={`/products/${product.handle}`}
                        className="group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                          {product.featuredImage && (
                            <Image
                              data={product.featuredImage}
                              aspectRatio="1/1"
                              sizes="(min-width: 768px) 25vw, 50vw"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-gray-600">
                          <Money data={product.priceRange.minVariantPrice} />
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              );
            }}
          </Await>
        </Suspense>
      </div>
      
      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            className="max-w-4xl max-h-[90vh] relative"
          >
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
              onClick={() => setShowImageModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ProductImage image={displayImage || images?.edges?.[activeImageIndex]?.node} />
          </motion.div>
        </div>
      )}
      
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </motion.div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    tags
    encodedVariantExistence
    encodedVariantAvailability
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    metafields(identifiers: [
      {namespace: "custom", key: "supported_brands"},
      {namespace: "custom", key: "brand_models"},
      {namespace: "custom", key: "model_images"}
    ]) {
      key
      namespace
      value
      type
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(handle: $handle, limit: 8) {
      id
      title
      handle
      featuredImage {
        id
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
` as const;