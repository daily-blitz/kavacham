import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
import { motion } from 'framer-motion';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''} ${layout === 'aside' ? 'cart-main-aside' : 'cart-main-page'}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      {linesCount && (
        <div className={layout === 'page' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : ''}>
          <div className={layout === 'page' ? 'md:col-span-2' : ''} aria-labelledby="cart-lines">
            {layout === 'page' && (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Items in Your Cart</h2>
              </div>
            )}
            <ul className="space-y-6">
              {(cart?.lines?.nodes ?? []).map((line, index) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CartLineItem line={line} layout={layout} />
                </motion.div>
              ))}
            </ul>
          </div>
          {cartHasItems && (
            <div className={layout === 'page' ? 'md:col-span-1' : ''}>
              <CartSummary cart={cart} layout={layout} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const { close } = useAside();
  return (
    <div hidden={hidden} className="text-center py-12">
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
      <p className="text-gray-600 mb-8">
        Looks like you haven&apos;t added anything yet, let&apos;s get you started!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="btn btn-primary inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
      >
        Browse Collections
      </Link>
    </div>
  );
}
