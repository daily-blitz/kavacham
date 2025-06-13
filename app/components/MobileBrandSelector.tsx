import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';

interface MobileBrandSelectorProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  className?: string;
}

export function MobileBrandSelector({
  brands,
  selectedBrand,
  onBrandChange,
  className = '',
}: MobileBrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.brand-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={`brand-selector relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Mobile Brand
      </label>
      
      <button
        type="button"
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black hover:border-gray-400 transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate pr-8">
          {selectedBrand || 'Choose a brand...'}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center justify-center pr-3 pointer-events-none">
          <motion.svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </motion.svg>
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        >
          {brands.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No brands available</div>
          ) : (
            brands.map((brand) => (
              <button
                key={brand}
                type="button"
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                  selectedBrand === brand
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'text-gray-900'
                }`}
                onClick={() => {
                  onBrandChange(brand);
                  setIsOpen(false);
                }}
              >
                {brand}
              </button>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}