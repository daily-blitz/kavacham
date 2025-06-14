import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {useVariantUrl} from '~/lib/variants';
import {CartForm} from '@shopify/hydrogen';

interface FeaturedProductProps {
  product: any; // Using any temporarily to fix type issues
  index: number;
}

export function FeaturedProduct({product, index}: FeaturedProductProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const firstVariant = product.variants.nodes[0];
  
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: index * 0.1}}
      className="featured-product bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 h-full flex flex-col"
    >
      <Link
        to={variantUrl}
        className="group block relative overflow-hidden rounded-lg flex-shrink-0"
      >
        {image && (
          <div className="aspect-square overflow-hidden rounded-lg mb-4">
            <Image
              data={image}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          </div>
        )}
      </Link>
      
      <div className="text-center flex flex-col flex-grow space-y-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] flex items-center justify-center">
          {product.title}
        </h3>
        <div className="text-lg font-bold text-gray-900 py-1">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
        
        <div className="mt-auto pt-2">
          {firstVariant?.availableForSale && (
            <CartForm
              route="/cart"
              inputs={{
                lines: [
                  {
                    merchandiseId: firstVariant.id,
                    quantity: 1,
                  },
                ],
              }}
              action={CartForm.ACTIONS.LinesAdd}
            >
              {(fetcher) => (
                <button
                  type="submit"
                  disabled={fetcher.state !== 'idle'}
                  className="w-full inline-flex items-center justify-center bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
                >
                  {fetcher.state !== 'idle' ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
            </CartForm>
          )}
          
          {!firstVariant?.availableForSale && (
            <button
              disabled
              className="w-full inline-flex items-center justify-center bg-white text-gray-400 border-2 border-gray-300 py-2.5 px-4 rounded-lg text-sm font-semibold cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
