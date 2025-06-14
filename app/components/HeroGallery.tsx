import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {useState, useEffect} from 'react';
import type {Maybe} from '@shopify/hydrogen/storefront-api-types';

interface RichTextNode {
  text: string;
  bold: boolean;
}

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: RichTextNode[] | string;
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

// Helper function to render rich text
function renderRichText(content: RichTextNode[] | string | undefined) {
  if (!content) return null;
  
  if (typeof content === 'string') {
    return content;
  }
  
  return content.map((node, index) => (
    <span key={index} className={node.bold ? 'font-bold' : ''}>
      {node.text}
    </span>
  ));
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
    <div className="hero-gallery relative overflow-hidden">
      {/* Mobile Layout: Traditional Carousel */}
      <div className="block lg:hidden">
        <div className="relative w-full" style={{ minHeight: 'calc(100vh - 70px)' }}>
          {/* Image Background */}
          <div className="absolute inset-0">
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

          {/* Overlay */}
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          )}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6">
            <motion.h1
              key={`mobile-title-${currentSlide}`}
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white max-w-4xl"
            >
              {currentSlideData.title}
            </motion.h1>
            
            {currentSlideData.subtitle && (
              <motion.div
                key={`mobile-subtitle-${currentSlide}`}
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6, delay: 0.2}}
                className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl space-y-2"
              >
                {Array.isArray(currentSlideData.subtitle) ? (
                  currentSlideData.subtitle.map((node, index) => (
                    <p key={index}>
                      <span className={node.bold ? 'font-bold' : ''}>
                        {node.text}
                      </span>
                    </p>
                  ))
                ) : (
                  <p>{currentSlideData.subtitle}</p>
                )}
              </motion.div>
            )}
            
            <motion.div
              key={`mobile-cta-${currentSlide}`}
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.4}}
              className="mt-6"
            >
              <Link
                to={currentSlideData.ctaLink || '/collections/all'}
                className="inline-flex items-center justify-center bg-white text-black border-2 border-black hover:bg-black hover:!text-white px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                {currentSlideData.ctaText || 'Shop Now'}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Navigation Controls */}
          {slides.length > 1 && (
            <>
              {/* Previous/Next Buttons */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors touch-manipulation"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors touch-manipulation"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Navigation */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                      index === currentSlide 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout: K-shaped Design */}
      <div className="hidden lg:flex" style={{ minHeight: 'calc(100vh - 70px)' }}>
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
        <div className="w-2/5 bg-gray-50 flex flex-col items-start justify-center py-20 xl:py-32 px-8 xl:px-12">
          <motion.h1
            key={`desktop-title-${currentSlide}`}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-4 text-gray-900"
          >
            {currentSlideData.title}
          </motion.h1>
          
          {currentSlideData.subtitle && (
            <motion.div
              key={`desktop-subtitle-${currentSlide}`}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.2}}
              className="text-base xl:text-lg text-gray-700 leading-relaxed space-y-2"
            >
              {Array.isArray(currentSlideData.subtitle) ? (
                currentSlideData.subtitle.map((node, index) => (
                  <p key={index}>
                    <span className={node.bold ? 'font-bold' : ''}>
                      {node.text}
                    </span>
                  </p>
                ))
              ) : (
                <p>{currentSlideData.subtitle}</p>
              )}
            </motion.div>
          )}
          
          <motion.div
            key={`desktop-cta-${currentSlide}`}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.4}}
            className="mt-8"
          >
            <Link
              to={currentSlideData.ctaLink || '/collections/all'}
              className="inline-flex items-center justify-center bg-white text-black border-2 border-black hover:bg-black hover:!text-white px-8 py-3 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              {currentSlideData.ctaText || 'Shop Now'}
            </Link>
          </motion.div>
        </div>

        {/* Desktop Navigation Controls */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 right-8 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gray-900 scale-125' 
                    : 'bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}