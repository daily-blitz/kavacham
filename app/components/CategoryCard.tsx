import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {Maybe} from '@shopify/hydrogen/storefront-api-types';

interface CategoryCardProps {
  title: string;
  description?: string | null;
  image?: Maybe<{
    id?: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  }> | null;
  link: string;
  productCount?: number;
  index?: number;
  disabled?: boolean;
}

export function CategoryCard({title, description, image, link, productCount, index = 0, disabled = false}: CategoryCardProps) {
  const isDisabled = disabled || (productCount === 0);
  
  const cardContent = (
    <div className="aspect-[4/5] relative overflow-hidden">
      {image ? (
        <>
          <Image
            data={image}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              !isDisabled ? 'group-hover:scale-110' : ''
            }`}
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
          {title}
        </h3>
        {description && (
          <p className={`text-sm md:text-base text-gray-200 mb-4 line-clamp-2 transition-opacity duration-300 delay-100 ${
            !isDisabled ? 'opacity-0 group-hover:opacity-100' : 'opacity-70'
          }`}>
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium opacity-90">
            {isDisabled ? 'No Products Available' : (productCount ? `${productCount} Products` : 'View Collection')}
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
        <Link to={link} className="block relative h-full">
          {cardContent}
        </Link>
      )}
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-700" />
      </div>
    </motion.div>
  );
}