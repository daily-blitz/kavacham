import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {motion} from 'framer-motion';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  
  return (
    <motion.div 
      className="product-card"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      whileHover={{y: -5}}
    >
      <Link
        className="product-item block"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          {image && (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="transition-transform duration-500 hover:scale-105"
            />
          )}
        </div>
        <div className="p-4">
          <h4 className="text-lg font-medium">{product.title}</h4>
          <div className="mt-2">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
