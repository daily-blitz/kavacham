import {
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from 'react-router';
import {motion} from 'framer-motion';

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
              countryCode
              city
              zip
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
                countryCode
                city
                zip
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container-custom py-8">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Account
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Welcome back{customer?.firstName ? `, ${customer.firstName}` : ''}
              </p>
            </div>
            <Logout />
          </motion.div>
        </div>
      </div>
      
      <div className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-4">
            <motion.div
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.2}}
              className="lg:col-span-1"
            >
              <AccountMenu />
            </motion.div>
            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.4}}
              className="lg:col-span-3"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <Outlet />
              </div>
            </motion.div>
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
      <h3 className="text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6 uppercase tracking-wide">
        Account Menu
      </h3>
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{opacity: 0, x: -10}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.3, delay: index * 0.1}}
          >
            <NavLink 
              to={item.to}
              end={item.end}
              className={({isActive}) => 
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-105 hover:shadow-md'
                }`
              }
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              {item.label}
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </div>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout">
      <motion.button 
        type="submit"
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
        className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <span className="text-lg">🚪</span>
        Sign out
      </motion.button>
    </Form>
  );
}
