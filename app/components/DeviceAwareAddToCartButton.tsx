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
            className={`btn btn-primary w-full ${className}`}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}