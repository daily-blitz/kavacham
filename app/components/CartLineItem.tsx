import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from 'react-router';
import { ProductPrice } from './ProductPrice';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { motion } from 'framer-motion';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const { id, merchandise, attributes } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  // Extract device selection from line item attributes
  const deviceBrand = attributes?.find(attr => attr.key === 'Device Brand')?.value;
  const deviceModel = attributes?.find(attr => attr.key === 'Device Model')?.value;

  return (
    <li key={id} className="flex items-start p-4 border border-gray-200 rounded-lg bg-white">
      {/* Product Image */}
      <div className="flex-shrink-0 mr-4">
        {image && (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        {/* Product Title and Remove Button Row */}
        <div className="flex justify-between items-start mb-2">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            className="hover:text-gray-600 transition-colors flex-grow mr-2"
          >
            <h3 className="font-medium text-base leading-tight line-clamp-2">
              {product.title}
            </h3>
          </Link>
          
          <CartLineRemoveButton
            lineIds={[id]}
            disabled={!!line.isOptimistic}
            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 p-1"
          />
        </div>

        {/* Vendor */}
        {product.vendor && (
          <p className="text-sm text-gray-500 mb-2">
            by {product.vendor}
          </p>
        )}

        {/* Device Selection */}
        {(deviceBrand || deviceModel) && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-700">
              For: <span className="font-medium text-gray-900">
                {deviceBrand} {deviceModel}
              </span>
            </p>
          </div>
        )}

        {/* Price and Quantity Row */}
        <div className="flex justify-between items-center">
          <div className="text-gray-900 font-medium">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>
          
          <CartLineQuantity line={line} layout={layout} />
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({ line, layout }: { line: CartLine; layout: CartLayout }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="w-9 h-9 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span>−</span>
          </button>
        </CartLineUpdateButton>

        <span className="w-12 text-center font-medium text-gray-900 text-sm">
          {quantity}
        </span>

        <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="w-9 h-9 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span>+</span>
          </button>
        </CartLineUpdateButton>
      </div>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
  className,
}: {
  lineIds: string[];
  disabled: boolean;
  className?: string;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button
        disabled={disabled}
        type="submit"
        className={`${className} flex items-center justify-center w-6 h-6 rounded-full hover:bg-red-50 transition-colors`}
        aria-label="Remove item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
