import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from 'react-router';
import { ProductPrice } from './ProductPrice';
import { useAside } from './Aside';
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
  const { close } = useAside();

  // Extract device selection from line item attributes
  const deviceBrand = attributes?.find(attr => attr.key === 'Device Brand')?.value;
  const deviceModel = attributes?.find(attr => attr.key === 'Device Model')?.value;

  return (
    <li key={id} className={`${layout === 'page' ? 'flex items-start p-4 border border-gray-200 rounded-lg' : 'cart-line'}`}>
      <div className={`${layout === 'page' ? 'flex-shrink-0 mr-4' : ''}`}>
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={layout === 'page' ? 120 : 80}
            loading="lazy"
            width={layout === 'page' ? 120 : 80}
            className="rounded-md"
          />
        )}
      </div>

      <div className={`${layout === 'page' ? 'flex-grow' : ''}`}>
        <div className={`${layout === 'page' ? 'flex justify-between' : ''}`}>
          <div>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
              className="hover:text-gray-600 transition-colors"
            >
              <p className="font-medium text-lg mb-1">
                {product.title}
              </p>
            </Link>

            <div className="text-gray-700 mb-2">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>

            <ul className="text-sm text-gray-500 mb-3">
              {selectedOptions.map((option) => (
                <li key={option.name} className="inline-block mr-3">
                  {option.name}: <span className="font-medium">{option.value}</span>
                </li>
              ))}
            </ul>

            {(deviceBrand || deviceModel) && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-700">
                  Selected for: <span className="font-medium text-gray-900">
                    {deviceBrand} {deviceModel}
                  </span>
                </p>
              </div>
            )}
          </div>

          {layout === 'page' && (
            <CartLineRemoveButton
              lineIds={[id]}
              disabled={!!line.isOptimistic}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            />
          )}
        </div>

        <CartLineQuantity line={line} layout={layout} />
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
    <div className="flex items-center gap-2">
      <div className={`flex items-center ${layout === 'page' ? 'border border-gray-300 rounded-md' : ''}`}>
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className={`${layout === 'page' ? 'w-8 h-8 flex items-center justify-center text-lg font-medium hover:bg-gray-100 transition-colors' : 'w-6 h-6 flex items-center justify-center text-sm'}`}
          >
            <span>&#8722;</span>
          </button>
        </CartLineUpdateButton>

        <span className={`${layout === 'page' ? 'w-10 text-center font-medium' : 'w-8 text-center text-sm'}`}>
          {quantity}
        </span>

        <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className={`${layout === 'page' ? 'w-8 h-8 flex items-center justify-center text-lg font-medium hover:bg-gray-100 transition-colors' : 'w-6 h-6 flex items-center justify-center text-sm'}`}
          >
            <span>&#43;</span>
          </button>
        </CartLineUpdateButton>
      </div>

      {layout === 'aside' && (
        <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
      )}
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
        className={className}
      >
        Remove
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
