import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {useState, useEffect} from 'react';
import type {Maybe} from '@shopify/hydrogen/storefront-api-types';

interface HeroSlide {
  id: string;
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
}

interface HeroGalleryProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  overlay?: boolean;
}

export function HeroGallery({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  overlay = true,
}: HeroGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="hero-gallery relative overflow-hidden min-h-[500px] md:min-h-[600px] flex">
      {/* Left side - Images with K-shaped clipping */}
      <div className="relative w-3/5 overflow-hidden">
        {/* K-shaped clip path */}
        <div 
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 75% 50%, 100% 100%, 0 100%)'
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {slide.image && slide.image.url && (
                <img
                  src={slide.image.url}
                  alt={slide.image.altText || `Hero slide ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Gradient border along the diagonal edge */}
        <div className="absolute inset-0 pointer-events-none">
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="30%" stopColor="#ec4899" />
                <stop offset="70%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path 
              d="M 100 0 L 75 50 L 100 100 L 98 100 L 73 50 L 98 0 Z" 
              fill="url(#borderGradient)"
            />
          </svg>
        </div>
        
      </div>

      {/* Right side - Text Content with light background */}
      <div className="w-2/5 bg-gray-50 flex flex-col items-start justify-center py-20 md:py-32 lg:py-40 px-8 md:px-12">
        <motion.h1
          key={`title-${currentSlide}`}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900"
        >
          {currentSlideData.title}
        </motion.h1>
        
        {currentSlideData.subtitle && (
          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.2}}
            className="text-base md:text-lg text-gray-700 leading-relaxed"
            style={{marginBottom: '4rem'}}
          >
            {currentSlideData.subtitle}
          </motion.p>
        )}
        
        <div>
          <Link
            to={currentSlideData.ctaLink || '/collections/all'}
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 text-base font-medium transition-all duration-300 rounded"
          >
            {currentSlideData.ctaText || 'Shop Now'}
          </Link>
        </div>
      </div>

    </div>
  );
}