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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Account
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back{customer?.firstName ? `, ${customer.firstName}` : ''}
              </p>
            </div>
            <Logout />
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <AccountMenu />
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const menuItems = [
    { to: '/account', label: 'Dashboard', icon: '📊', end: true },
    { to: '/account/orders', label: 'Orders', icon: '📦' },
    { to: '/account/profile', label: 'Profile', icon: '👤' },
    { to: '/account/addresses', label: 'Addresses', icon: '📍' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        Account Menu
      </h3>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink 
            key={item.to}
            to={item.to}
            end={item.end}
            className={({isActive}) => 
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout">
      <button 
        type="submit"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm"
      >
        <span>🚪</span>
        Sign out
      </button>
    </Form>
  );
}
