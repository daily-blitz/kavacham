import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents, Link} from 'react-router';
import {motion} from 'framer-motion';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className = 'cart-summary-page';

  return (
    <motion.div 
      aria-labelledby="cart-summary" 
      className={`${className} bg-gray-50 p-4 md:p-6 rounded-lg md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-6rem)]`}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
    >
      <h4 className="text-lg font-medium mb-3">Summary</h4>
      <div className="space-y-2">
        <dl className="flex justify-between items-center py-2">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
        
        {cart.cost?.totalTaxAmount?.amount && (
          <dl className="flex justify-between items-center py-2">
            <dt className="text-sm text-gray-600">Taxes</dt>
            <dd className="text-sm font-medium">
              <Money data={cart.cost.totalTaxAmount} />
            </dd>
          </dl>
        )}
        
        
        <dl className="flex justify-between items-center py-2 border-t border-gray-200 pt-3 font-semibold">
          <dt>Total</dt>
          <dd>
            {cart.cost?.totalAmount?.amount ? (
              <Money data={cart.cost?.totalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
      </div>

      
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </motion.div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-6">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="block w-full btn btn-primary text-center"
      >
        Proceed to Checkout
      </a>
      <div className="mt-2 px-2 pb-2">
        <Link 
          to="/collections" 
          className="block text-center text-sm text-gray-600 hover:text-black transition-colors py-1"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

