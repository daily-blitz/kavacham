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
      className="featured-product"
    >
      <Link
        to={variantUrl}
        className="group block relative overflow-hidden rounded-lg"
      >
        {image && (
          <div className="aspect-square overflow-hidden">
            <Image
              data={image}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-medium">{product.title}</h3>
          <div className="mt-1">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
