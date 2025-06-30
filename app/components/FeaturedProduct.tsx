import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {useVariantUrl} from '~/lib/variants';

interface FeaturedProductProps {
  product: any; // Using any temporarily to fix type issues
  index: number;
}

export function FeaturedProduct({product, index}: FeaturedProductProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  
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
          <Link
            to={variantUrl}
            className="w-full inline-flex items-center justify-center bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            View Product
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
