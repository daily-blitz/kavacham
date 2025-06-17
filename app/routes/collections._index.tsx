import {useLoaderData, Link} from 'react-router';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {motion} from 'framer-motion';

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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Collections Grid */}
      <section className="container-custom py-12 md:py-16 lg:py-20">
        <PaginatedResourceSection
          connection={collections}
          resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {({node: collection, index}) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </section>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  const productCount = collection.products?.nodes?.length || 0;
  const isDisabled = productCount === 0;
  
  const cardContent = (
    <div className="aspect-[4/5] relative overflow-hidden">
      {collection?.image ? (
        <>
          <Image
            alt={collection.image.altText || collection.title}
            data={collection.image}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              !isDisabled ? 'group-hover:scale-110' : ''
            }`}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 ${
            !isDisabled ? 'group-hover:opacity-90' : ''
          }`} />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
      )}
      
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h3 className={`text-2xl md:text-3xl font-bold mb-2 transform transition-transform duration-300 ${
          !isDisabled ? 'group-hover:translate-y-[-4px]' : ''
        }`}>
          {collection.title}
        </h3>
        {collection.description && (
          <p className={`text-sm md:text-base text-gray-200 mb-4 line-clamp-2 transition-opacity duration-300 delay-100 ${
            !isDisabled ? 'opacity-0 group-hover:opacity-100' : 'opacity-70'
          }`}>
            {collection.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium opacity-90">
            {isDisabled ? 'No Products Available' : `${productCount} Products`}
          </span>
          <motion.div
            className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors duration-300 ${
              !isDisabled ? 'group-hover:bg-white/30' : ''
            }`}
            whileHover={!isDisabled ? {scale: 1.1} : {}}
            whileTap={!isDisabled ? {scale: 0.95} : {}}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
  
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: index * 0.1}}
      whileHover={!isDisabled ? {y: -8, transition: {duration: 0.2}} : {}}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg transition-all duration-300 ${
        isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-2xl'
      }`}
    >
      {isDisabled ? (
        <div className="block relative h-full cursor-not-allowed">
          {cardContent}
        </div>
      ) : (
        <Link to={`/collections/${collection.handle}`} className="block relative h-full" prefetch="intent">
          {cardContent}
        </Link>
      )}
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-700" />
      </div>
    </motion.div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
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
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
