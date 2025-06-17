import {
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from 'react-router';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccount = context.customerAccount;
  
  try {
    const customer = await customerAccount.query(
      `#graphql
        query CustomerDetails {
          customer {
            id
            firstName
            lastName
            defaultAddress {
              id
              formatted
              firstName
              lastName
              company
              address1
              address2
              territoryCode
              zoneCode
              city
              zip
              phoneNumber
            }
            addresses(first: 6) {
              nodes {
                id
                formatted
                firstName
                lastName
                company
                address1
                address2
                territoryCode
                zoneCode
                city
                zip
                phoneNumber
              }
            }
          }
        }
      `
    );
    
    return {customer};
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      return customerAccount.login();
    }
    throw error;
  }
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();
  
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome{customer?.firstName ? `, ${customer.firstName}` : ''}
          </h1>
          <Logout />
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <AccountMenu />
          </div>
          <div className="md:col-span-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <nav className="space-y-2">
      <NavLink 
        to="/account/orders" 
        className={({isActive}) => 
          `block px-4 py-2 rounded-lg transition-colors ${
            isActive 
              ? 'bg-black text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        Orders
      </NavLink>
      <NavLink 
        to="/account/profile" 
        className={({isActive}) => 
          `block px-4 py-2 rounded-lg transition-colors ${
            isActive 
              ? 'bg-black text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        Profile
      </NavLink>
      <NavLink 
        to="/account/addresses" 
        className={({isActive}) => 
          `block px-4 py-2 rounded-lg transition-colors ${
            isActive 
              ? 'bg-black text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        Addresses
      </NavLink>
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout">
      <button 
        type="submit"
        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Sign out
      </button>
    </Form>
  );
}
