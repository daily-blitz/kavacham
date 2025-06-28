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
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <motion.div 
      aria-labelledby="cart-summary" 
      className={`${className} ${layout === 'page' ? 'bg-gray-50 p-6 rounded-lg sticky top-24 self-start max-h-[calc(100vh-6rem)]' : ''}`}
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

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="py-3">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length} className="flex justify-between items-center mb-3 text-sm">
        <div>
          <dt className="text-gray-600 mb-1">Applied Discount</dt>
          <UpdateDiscountForm>
            <div className="flex items-center">
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{codes?.join(', ')}</code>
              <button className="ml-2 text-red-500 text-xs hover:text-red-700 transition-colors">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex mt-3">
          <input 
            type="text" 
            name="discountCode" 
            placeholder="Discount code" 
            className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button 
            type="submit"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-r-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div className="py-3 border-b border-gray-200">
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length} className="flex justify-between items-center mb-3 text-sm">
        <div>
          <dt className="text-gray-600 mb-1">Applied Gift Card</dt>
          <UpdateGiftCardForm>
            <div className="flex items-center">
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{codes?.join(', ')}</code>
              <button 
                className="ml-2 text-red-500 text-xs hover:text-red-700 transition-colors"
                onClick={() => removeAppliedCode()}
              >
                Remove
              </button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="flex mt-3">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button 
            type="submit"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-r-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
