import {useState, useMemo, useEffect} from 'react';
import {motion} from 'framer-motion';
import {MobileBrandSelector} from './MobileBrandSelector';
import {MobileModelSelector} from './MobileModelSelector';

interface MobileMetafield {
  key: string;
  namespace: string;
  value: string;
  type: string;
}

interface MobileSelectorProps {
  variants: any[];
  selectedVariant: any;
  onVariantChange: (variantId: string) => void;
  className?: string;
}

interface MobileModel {
  name: string;
  image?: string;
}

interface BrandModels {
  [brandName: string]: MobileModel[];
}

export function MobileSelector({
  variants,
  selectedVariant,
  onVariantChange,
  className = '',
}: MobileSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  // Extract brands and models from variant metafields
  const {brands, brandModels, variantMapping} = useMemo(() => {
    const brandSet = new Set<string>();
    const brandModels: BrandModels = {};
    const variantMapping: {[key: string]: string} = {}; // "brand-model" -> variantId

    // Filter out invalid variants first
    const validVariants = variants.filter(variant => variant && variant.id);

    validVariants.forEach(variant => {
      if (!variant.metafields || !Array.isArray(variant.metafields)) return;
      
      try {
        const brandField = variant.metafields.find((m: any) => m && m.key === 'compatible_brand' && m.namespace === 'custom');
        const modelField = variant.metafields.find((m: any) => m && m.key === 'compatible_model' && m.namespace === 'custom');
        const showcaseImageField = variant.metafields.find((m: any) => m && m.key === 'model_showcase_image' && m.namespace === 'custom');
        
        if (brandField?.value && modelField?.value) {
          const brand = String(brandField.value).trim();
          const model = String(modelField.value).trim();
          const showcaseImage = showcaseImageField?.value ? String(showcaseImageField.value) : undefined;
          
          if (brand && model) {
            brandSet.add(brand);
            
            if (!brandModels[brand]) {
              brandModels[brand] = [];
            }
            
            // Check if this model already exists for this brand
            const existingModel = brandModels[brand].find(m => m.name === model);
            if (!existingModel) {
              brandModels[brand].push({
                name: model,
                image: showcaseImage || variant.image?.url,
              });
            }
            
            variantMapping[`${brand}-${model}`] = variant.id;
          }
        }
      } catch (error) {
        console.warn('Error processing variant metafields:', error, variant);
      }
    });

    return {
      brands: Array.from(brandSet).sort(),
      brandModels,
      variantMapping,
    };
  }, [variants]);

  // Get models for selected brand
  const availableModels = useMemo(() => {
    return selectedBrand ? brandModels[selectedBrand] || [] : [];
  }, [selectedBrand, brandModels]);

  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel(''); // Reset model when brand changes
  };

  // Handle model selection
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const variantKey = `${selectedBrand}-${model}`;
    const variantId = variantMapping[variantKey];
    if (variantId) {
      onVariantChange(variantId);
    }
  };

  // Set initial selection based on current variant
  useEffect(() => {
    if (selectedVariant?.metafields && Array.isArray(selectedVariant.metafields)) {
      try {
        const brandField = selectedVariant.metafields.find((m: any) => m && m.key === 'compatible_brand' && m.namespace === 'custom');
        const modelField = selectedVariant.metafields.find((m: any) => m && m.key === 'compatible_model' && m.namespace === 'custom');
        
        if (brandField?.value && modelField?.value) {
          const brand = String(brandField.value).trim();
          const model = String(modelField.value).trim();
          
          if (brand && model) {
            setSelectedBrand(brand);
            setSelectedModel(model);
          }
        }
      } catch (error) {
        console.warn('Error setting initial mobile selection:', error);
      }
    }
  }, [selectedVariant]);

  // Don't render if no brands available
  if (brands.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`mobile-selector-container ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Select Your Mobile Device
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MobileBrandSelector
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandChange}
          />
          
          <MobileModelSelector
            models={availableModels}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            disabled={!selectedBrand}
          />
        </div>
        
        {selectedBrand && selectedModel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-3 bg-white rounded-md border border-gray-200"
          >
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium text-gray-900">{selectedBrand} {selectedModel}</span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}