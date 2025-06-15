import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

interface MobileBrandSelectorProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  className?: string;
}

// Popular brand logos mapping
const BRAND_LOGOS: Record<string, string> = {
  'Apple': '🍎',
  'Samsung': '📱',
  'Google': '🔍',
  'OnePlus': '➕',
  'Xiaomi': '🔶',
  'Realme': '👑',
  'Oppo': '🟢',
  'Vivo': '🔵',
  'Nothing': '⚪',
  'Motorola': 'M',
  'Nokia': '📞',
  'Huawei': '🌐',
};

export function MobileBrandSelector({
  brands,
  selectedBrand,
  onBrandChange,
  className = '',
}: MobileBrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Mobile Brand
      </label>
      
      <button
        type="button"
        className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-300 transition-all duration-200 relative group"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {selectedBrand && (
            <span className="text-lg">{BRAND_LOGOS[selectedBrand] || '📱'}</span>
          )}
          <span className="block truncate font-medium">
            {selectedBrand || 'Choose a brand...'}
          </span>
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <motion.svg
            className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Search Input */}
            {brands.length > 5 && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Search brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-60 overflow-auto">
              {filteredBrands.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No brands found</div>
              ) : (
                filteredBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center gap-3 ${
                      selectedBrand === brand
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'text-gray-900'
                    }`}
                    onClick={() => {
                      onBrandChange(brand);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <span className="text-lg">{BRAND_LOGOS[brand] || '📱'}</span>
                    <span className="font-medium">{brand}</span>
                    {selectedBrand === brand && (
                      <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}