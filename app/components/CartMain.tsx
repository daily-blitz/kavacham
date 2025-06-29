import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
import { motion } from 'framer-motion';

export type CartLayout = 'page';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by the /cart route.
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''} cart-main-page`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      {linesCount && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 min-h-[400px]" aria-labelledby="cart-lines">
            <div className="mb-4 md:mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold">Items in Your Cart</h2>
            </div>
            <ul className="space-y-4 md:space-y-6 pb-4 md:pb-8">
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
            <div className="md:col-span-1">
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
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center h-full py-8 md:py-16 px-4">
      {/* Animated Cart Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="mb-6 md:mb-8"
      >
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32"
              className="md:w-10 md:h-10"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          {/* Floating dots animation */}
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded-full opacity-60"
          />
          <motion.div
            animate={{ y: [2, -2, 2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-1 -left-2 w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full opacity-40"
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center space-y-3 md:space-y-4 max-w-sm mx-auto"
      >
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Your Cart Awaits</h2>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed px-2">
          Ready to find something amazing? Discover our premium collection of mobile accessories designed for style and protection.
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 md:mt-8 w-full max-w-xs px-4"
      >
        <Link
          to="/collections/all"
          prefetch="viewport"
          className="w-full inline-flex items-center justify-center bg-white text-black border-2 border-black hover:bg-black hover:!text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <span>Explore Products</span>
          <svg 
            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-400 mb-2">Popular Categories</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/collections/phone-skins"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Phone Skins
          </Link>
          <Link
            to="/collections/covers"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Covers
          </Link>
          <Link
            to="/collections/accessories"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Accessories
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
