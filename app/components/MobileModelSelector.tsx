import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

interface MobileModel {
  name: string;
  image?: string;
}

interface MobileModelSelectorProps {
  models: MobileModel[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MobileModelSelector({
  models,
  selectedModel,
  onModelChange,
  disabled = false,
  className = '',
}: MobileModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.model-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdown when disabled
  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <div className={`model-selector relative ${className}`}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Mobile Model
      </label>
      
      <button
        type="button"
        className={`w-full px-4 py-3 text-left bg-white border-2 rounded-xl shadow-sm focus:outline-none transition-all duration-200 relative group ${
          disabled
            ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-300'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {!disabled && selectedModel && (
            <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <span className="block truncate font-medium">
            {disabled
              ? 'Select a brand first...'
              : selectedModel || 'Choose a model...'}
          </span>
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <motion.svg
            className={`h-5 w-5 transition-colors ${disabled ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`}
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
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Search Input */}
            {models.length > 5 && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-60 overflow-auto">
              {filteredModels.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {searchQuery ? 'No models match your search' : 'No models available for this brand'}
                </div>
              ) : (
                filteredModels.map((model) => (
                  <button
                    key={model.name}
                    type="button"
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center gap-3 ${
                      selectedModel === model.name
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'text-gray-900'
                    }`}
                    onClick={() => {
                      onModelChange(model.name);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="flex-shrink-0">
                      {model.image ? (
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-8 h-8 object-cover rounded-lg border border-gray-200"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="font-medium flex-grow">{model.name}</span>
                    {selectedModel === model.name && (
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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