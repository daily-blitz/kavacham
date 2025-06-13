import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';

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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Mobile Model
      </label>
      
      <button
        type="button"
        className={`w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none transition-colors relative ${
          disabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'focus:ring-2 focus:ring-black focus:border-black hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate pr-8">
          {disabled
            ? 'Select a brand first...'
            : selectedModel || 'Choose a model...'}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center justify-center pr-3 pointer-events-none">
          <motion.svg
            className={`h-5 w-5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`}
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

      {isOpen && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        >
          {models.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No models available for this brand</div>
          ) : (
            models.map((model) => (
              <button
                key={model.name}
                type="button"
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors flex items-center gap-3 ${
                  selectedModel === model.name
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'text-gray-900'
                }`}
                onClick={() => {
                  onModelChange(model.name);
                  setIsOpen(false);
                }}
              >
                {model.image && (
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-8 h-8 object-cover rounded"
                    loading="lazy"
                  />
                )}
                <span>{model.name}</span>
              </button>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}