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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-gray-600">Manage your personal information and account details.</p>
      </div>

      <Form method="PUT" className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        {action?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <p className="text-red-800 text-sm">{action.error}</p>
            </div>
          </div>
        )}

        {action?.customer && !action?.error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <p className="text-green-800 text-sm">Profile updated successfully!</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={state !== 'idle'}
            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {state !== 'idle' ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⟳</span>
                Updating...
              </span>
            ) : (
              'Update Profile'
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
