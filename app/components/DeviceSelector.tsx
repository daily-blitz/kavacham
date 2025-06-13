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
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Select Your Device
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          This case is compatible with multiple devices. Please select your device for accurate fitting:
        </p>
        
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
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700">
                Selected for: <span className="font-medium text-gray-900">{selectedBrand} {selectedModel}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This selection will be noted in your order for proper fulfillment.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}