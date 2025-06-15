import {useState, useMemo, useEffect} from 'react';
import {motion} from 'framer-motion';
import {MobileBrandSelector} from './MobileBrandSelector';
import {MobileModelSelector} from './MobileModelSelector';

interface DeviceMetafield {
  key: string;
  namespace: string;
  value: string;
  type: string;
}

interface DeviceSelectorProps {
  metafields: DeviceMetafield[];
  onSelectionChange: (brand: string, model: string, modelImage?: string) => void;
  className?: string;
}

interface DeviceModel {
  name: string;
  image?: string;
}

interface BrandModels {
  [brandName: string]: DeviceModel[];
}

export function DeviceSelector({
  metafields,
  onSelectionChange,
  className = '',
}: DeviceSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  // Parse metafields to extract brands and models
  const {brands, brandModels} = useMemo(() => {
    const brandsField = metafields.find(m => m && m.key === 'supported_brands' && m.namespace === 'custom');
    const modelsField = metafields.find(m => m && m.key === 'brand_models' && m.namespace === 'custom');
    const imagesField = metafields.find(m => m && m.key === 'model_images' && m.namespace === 'custom');

    let parsedBrands: string[] = [];
    let parsedBrandModels: BrandModels = {};

    try {
      // Parse brands
      if (brandsField?.value) {
        const brandData = JSON.parse(brandsField.value);
        parsedBrands = Array.isArray(brandData) ? brandData.filter((item: any) => typeof item === 'string') : [];
      }

      // Parse models and images
      if (modelsField?.value) {
        const modelData = JSON.parse(modelsField.value) as Record<string, string[]>;
        const imageData = imagesField?.value ? JSON.parse(imagesField.value) as Record<string, Record<string, string>> : {};
        
        Object.keys(modelData).forEach(brand => {
          const models = Array.isArray(modelData[brand]) ? modelData[brand] : [];
          parsedBrandModels[brand] = models.map((model: string) => ({
            name: model,
            image: typeof imageData[brand]?.[model] === 'string' ? imageData[brand][model] : 
                   typeof imageData[model] === 'string' ? imageData[model] : undefined,
          }));
        });
      }
    } catch (error) {
      console.warn('Error parsing device metafields:', error);
    }

    return {
      brands: parsedBrands,
      brandModels: parsedBrandModels,
    };
  }, [metafields]);

  // Get models for selected brand
  const availableModels = useMemo(() => {
    return selectedBrand ? brandModels[selectedBrand] || [] : [];
  }, [selectedBrand, brandModels]);

  // Auto-select first brand and first model on load
  useEffect(() => {
    if (brands.length > 0 && !selectedBrand) {
      const firstBrand = brands[0];
      setSelectedBrand(firstBrand);
      
      const firstBrandModels = brandModels[firstBrand] || [];
      if (firstBrandModels.length > 0) {
        const firstModel = firstBrandModels[0];
        setSelectedModel(firstModel.name);
        onSelectionChange(firstBrand, firstModel.name, firstModel.image);
      }
    }
  }, [brands, brandModels, selectedBrand, onSelectionChange]);

  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    
    // Auto-select first model in the new brand
    const modelsForBrand = brandModels[brand] || [];
    if (modelsForBrand.length > 0) {
      const firstModel = modelsForBrand[0];
      setSelectedModel(firstModel.name);
      onSelectionChange(brand, firstModel.name, firstModel.image);
    } else {
      setSelectedModel('');
      onSelectionChange(brand, '', undefined);
    }
  };

  // Handle model selection
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const modelData = availableModels.find(m => m.name === model);
    onSelectionChange(selectedBrand, model, modelData?.image);
  };

  // Don't render if no brands available
  if (brands.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`device-selector-container ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-900 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Select Your Device
            </h3>
            <p className="text-sm text-gray-600">
              Choose your device for the perfect fit
            </p>
          </div>
        </div>
        
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Perfect Match Found!
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedBrand} {selectedModel}
                  </p>
                </div>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}