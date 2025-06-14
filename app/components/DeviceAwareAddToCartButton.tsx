import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

interface DeviceAwareAddToCartButtonProps {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: OptimisticCartLineInput[];
  onClick?: () => void;
  selectedDevice?: {
    brand: string;
    model: string;
  };
  className?: string;
}

export function DeviceAwareAddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  selectedDevice,
  className = '',
}: DeviceAwareAddToCartButtonProps) {
  // Add device selection as line item properties
  const enhancedLines = lines.map(line => ({
    ...line,
    attributes: [
      ...(line.attributes || []),
      ...(selectedDevice?.brand ? [{ key: 'Device Brand', value: selectedDevice.brand }] : []),
      ...(selectedDevice?.model ? [{ key: 'Device Model', value: selectedDevice.model }] : []),
      ...(selectedDevice?.brand && selectedDevice?.model ? 
        [{ key: 'Device', value: `${selectedDevice.brand} ${selectedDevice.model}` }] : []
      ),
    ],
  }));

  return (
    <CartForm route="/cart" inputs={{lines: enhancedLines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`w-full inline-flex items-center justify-center bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black ${className}`}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}