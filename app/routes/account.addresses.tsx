import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
  type Fetcher,
} from 'react-router';
import {motion} from 'framer-motion';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: MetaFunction = () => {
  return [{title: 'Addresses'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {address, defaultAddress},
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {addressId: decodeURIComponent(addressId)},
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const context = useOutletContext<{customer: CustomerFragment}>();
  const customer = context?.customer;
  
  if (!context || !customer) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  const {defaultAddress, addresses} = customer;

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          Shipping Addresses
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Manage your delivery locations for faster and more convenient checkout experiences.
        </p>
      </motion.div>

      {/* Add New Address Section */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.2}}
        className="bg-gradient-to-br from-white via-gray-50/30 to-white rounded-3xl p-8 md:p-10 border border-gray-200/50 shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
              <span className="text-2xl text-white">📍</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Add New Address</h3>
              <p className="text-gray-600">Set up a new shipping destination</p>
            </div>
          </div>
          <NewAddressForm />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-50/30 to-transparent rounded-full blur-xl" />
      </motion.div>

      {addresses.nodes.length > 0 ? (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.4}}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Saved Addresses
              </h3>
              <p className="text-gray-600">Quick access to your delivery locations</p>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200/50">
                <p className="text-sm text-gray-500 mb-1">Total Addresses</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {addresses.nodes.length}
                </p>
              </div>
            </div>
          </div>
          <ExistingAddresses
            addresses={addresses}
            defaultAddress={defaultAddress}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.6, delay: 0.4}}
          className="flex flex-col items-center justify-center text-center py-16"
        >
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
              <span className="text-4xl">📍</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No addresses saved</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-center">
            Add your first shipping address to make checkout faster and easier.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <div className="flex justify-end">
          <motion.button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            whileHover={stateForMethod('POST') === 'idle' ? {scale: 1.05} : {}}
            whileTap={stateForMethod('POST') === 'idle' ? {scale: 0.95} : {}}
            className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
          >
            {stateForMethod('POST') !== 'idle' ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-lg">⟳</span>
                Creating...
              </span>
            ) : (
              'Add Address'
            )}
          </motion.button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {addresses.nodes.map((address, index) => (
        <motion.div 
          key={address.id}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: index * 0.1}}
          className="group bg-gradient-to-br from-white via-gray-50/20 to-white border border-gray-200/50 rounded-3xl p-8 relative hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
          {defaultAddress?.id === address.id && (
            <div className="absolute top-6 right-6 z-10">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                ✓ DEFAULT
              </div>
            </div>
          )}
          
          <div className="mb-8 relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">🏠</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-xl mb-1">
                  {address.firstName} {address.lastName}
                </h4>
                {address.company && (
                  <p className="text-gray-600 font-medium bg-gray-50 inline-block px-3 py-1 rounded-full text-sm">
                    {address.company}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">📍</span>
                <div>
                  <p className="font-medium">{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p className="text-gray-600">{address.city}, {address.zoneCode} {address.zip}</p>
                </div>
              </div>
              
              {address.phoneNumber && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">📞</span>
                  <p className="font-medium">{address.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>

          <AddressForm
            addressId={address.id}
            address={address}
            defaultAddress={defaultAddress}
          >
            {({stateForMethod}) => (
              <div className="flex gap-4 relative z-10">
                <motion.button
                  disabled={stateForMethod('PUT') !== 'idle'}
                  formMethod="PUT"
                  type="submit"
                  whileHover={stateForMethod('PUT') === 'idle' ? {scale: 1.05} : {}}
                  whileTap={stateForMethod('PUT') === 'idle' ? {scale: 0.95} : {}}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-sm font-semibold rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {stateForMethod('PUT') !== 'idle' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-lg">⟳</span>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      ✏️ Edit
                    </span>
                  )}
                </motion.button>
                <motion.button
                  disabled={stateForMethod('DELETE') !== 'idle'}
                  formMethod="DELETE"
                  type="submit"
                  whileHover={stateForMethod('DELETE') === 'idle' ? {scale: 1.05} : {}}
                  whileTap={stateForMethod('DELETE') === 'idle' ? {scale: 0.95} : {}}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {stateForMethod('DELETE') !== 'idle' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-lg">⟳</span>
                      Deleting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      🗑️ Delete
                    </span>
                  )}
                </motion.button>
              </div>
            )}
          </AddressForm>
          
          {/* Enhanced decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gray-100/15 to-transparent rounded-full blur-3xl group-hover:w-56 group-hover:h-56 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-50/20 to-transparent rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-700" />
        </motion.div>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  return (
    <Form id={addressId} className="space-y-6">
      <fieldset className="space-y-6">
        <input type="hidden" name="addressId" defaultValue={addressId} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-3">First name*</label>
            <input
              aria-label="First name"
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ''}
              id="firstName"
              name="firstName"
              placeholder="First name"
              required
              type="text"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-3">Last name*</label>
            <input
              aria-label="Last name"
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ''}
              id="lastName"
              name="lastName"
              placeholder="Last name"
              required
              type="text"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-3">Company</label>
          <input
            aria-label="Company"
            autoComplete="organization"
            defaultValue={address?.company ?? ''}
            id="company"
            name="company"
            placeholder="Company (optional)"
            type="text"
            className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="address1" className="block text-sm font-semibold text-gray-700 mb-3">Address line*</label>
            <input
              aria-label="Address line 1"
              autoComplete="address-line1"
              defaultValue={address?.address1 ?? ''}
              id="address1"
              name="address1"
              placeholder="Address line 1"
              required
              type="text"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label htmlFor="address2" className="block text-sm font-semibold text-gray-700 mb-3">Address line 2</label>
            <input
              aria-label="Address line 2"
              autoComplete="address-line2"
              defaultValue={address?.address2 ?? ''}
              id="address2"
              name="address2"
              placeholder="Address line 2 (optional)"
              type="text"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-3">City*</label>
            <input
              aria-label="City"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              id="city"
              name="city"
              placeholder="City"
              required
              type="text"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label htmlFor="zoneCode" className="block text-sm font-semibold text-gray-700 mb-3">State / Province*</label>
            <input
              aria-label="State/Province"
              autoComplete="address-level1"
              defaultValue={address?.zoneCode ?? ''}
              id="zoneCode"
              name="zoneCode"
              placeholder="State / Province"
              required
              type="text"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-3">Zip / Postal Code*</label>
            <input
              aria-label="Zip"
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ''}
              id="zip"
              name="zip"
              placeholder="Zip / Postal Code"
              required
              type="text"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="territoryCode" className="block text-sm font-semibold text-gray-700 mb-3">Country Code*</label>
            <input
              aria-label="territoryCode"
              autoComplete="country"
              defaultValue={address?.territoryCode ?? ''}
              id="territoryCode"
              name="territoryCode"
              placeholder="US"
              required
              type="text"
              maxLength={2}
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-3">Phone</label>
            <input
              aria-label="Phone Number"
              autoComplete="tel"
              defaultValue={address?.phoneNumber ?? ''}
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+1 (555) 123-4567"
              pattern="^\+?[1-9]\d{3,14}$"
              type="tel"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
          />
          <label htmlFor="defaultAddress" className="text-sm font-medium text-gray-900">
            Set as default address
          </label>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
              <p className="text-red-800 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </fieldset>
    </Form>
  );
}
