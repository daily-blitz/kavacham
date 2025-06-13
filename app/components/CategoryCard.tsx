import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {Maybe} from '@shopify/hydrogen/storefront-api-types';

interface CategoryCardProps {
  title: string;
  image?: Maybe<{
    id?: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  }> | null;
  link: string;
}

export function CategoryCard({title, image, link}: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{y: -5}}
      className="category-card relative overflow-hidden rounded-lg shadow-md"
    >
      <Link to={link} className="block relative">
        {image && (
          <div className="category-image-container aspect-square">
            <Image
              data={image}
              className="category-image w-full h-full object-cover"
              sizes="(min-width: 768px) 33vw, 50vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity hover:bg-opacity-30"></div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
      </Link>
    </motion.div>
  );
}
