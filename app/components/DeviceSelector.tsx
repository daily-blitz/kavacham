import {useState, useMemo, useEffect} from 'react';
import {motion} from 'framer-motion';
import {MobileDeviceSelector} from './MobileDeviceSelector';
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
        // Handle new schema: { "devices": ["iphone", "macbook", "ipad"] }
        if (brandData.devices && Array.isArray(brandData.devices)) {
          parsedBrands = brandData.devices.filter((item: any) => typeof item === 'string');
        } else if (Array.isArray(brandData)) {
          // Fallback for old schema (direct array)
          parsedBrands = brandData.filter((item: any) => typeof item === 'string');
        }
      }

      // Parse models and images
      if (modelsField?.value) {
        const modelData = JSON.parse(modelsField.value) as Record<string, string[]>;
        const imageData = imagesField?.value ? JSON.parse(imagesField.value) as Record<string, string> : {};
        
        Object.keys(modelData).forEach(brand => {
          const models = Array.isArray(modelData[brand]) ? modelData[brand] : [];
          // All models for a device use the same device image
          const deviceImage = typeof imageData[brand] === 'string' ? imageData[brand] : undefined;
          parsedBrandModels[brand] = models.map((model: string) => ({
            name: model,
            image: deviceImage, // Same image for all models of this device
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
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select Your Device
          </h3>
          <p className="text-sm text-gray-600">
            Choose your device for the perfect fit
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MobileDeviceSelector
            devices={brands}
            selectedDevice={selectedBrand}
            onDeviceChange={handleBrandChange}
          />
          
          <MobileModelSelector
            models={availableModels}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            disabled={!selectedBrand}
          />
        </div>
        
      </div>
    </motion.div>
  );
}