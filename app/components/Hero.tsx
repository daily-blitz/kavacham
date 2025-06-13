import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {Maybe} from '@shopify/hydrogen/storefront-api-types';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: Maybe<{
    id?: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  }> | null;
  overlay?: boolean;
}

export function Hero({
  title,
  subtitle,
  ctaText = 'Shop Now',
  ctaLink = '/collections/all',
  image,
  overlay = true,
}: HeroProps) {
  return (
    <div className="hero relative overflow-hidden min-h-[500px] md:min-h-[600px]">
      {image && image.url && (
        <div className="hero-image-container absolute inset-0 w-full h-full">
          <img
            src={image.url}
            alt={image.altText || 'Hero image'}
            className="hero-image w-full h-full object-cover"
            loading="eager"
            style={overlay ? {filter: 'brightness(0.7)'} : {}}
          />
        </div>
      )}
      <div className="container-custom relative z-5 flex flex-col items-center justify-center text-center py-20 md:py-32 lg:py-40">
        <motion.h1
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.2}}
            className="text-lg md:text-xl max-w-2xl mb-8 text-white"
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.4}}
        >
          <Link
            to={ctaLink}
            className="btn btn-primary px-8 py-3 text-base font-medium"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
