import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
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
} from 'react-router';
import {motion} from 'framer-motion';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  if (!account || !customer) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">Profile Settings</h2>
        <p className="text-gray-600 text-lg">Manage your personal information and account details.</p>
      </motion.div>

      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.2}}
      >
        <Form method="PUT" className="space-y-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-8 border border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              Personal Information
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.3}}
              >
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-3">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                  aria-label="First name"
                  defaultValue={customer.firstName ?? ''}
                  minLength={2}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                />
              </motion.div>
              
              <motion.div
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.4}}
              >
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-3">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  aria-label="Last name"
                  defaultValue={customer.lastName ?? ''}
                  minLength={2}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                />
              </motion.div>
            </div>
          </div>

          {action?.error && (
            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.3}}
              className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <p className="text-red-800 font-medium">{action.error}</p>
              </div>
            </motion.div>
          )}

          {action?.customer && !action?.error && (
            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.3}}
              className="bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
                <p className="text-green-800 font-medium">Profile updated successfully!</p>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end">
            <motion.button 
              type="submit" 
              disabled={state !== 'idle'}
              whileHover={state === 'idle' ? {scale: 1.05} : {}}
              whileTap={state === 'idle' ? {scale: 0.95} : {}}
              className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
            >
              {state !== 'idle' ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-lg">⟳</span>
                  Updating...
                </span>
              ) : (
                'Update Profile'
              )}
            </motion.button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
