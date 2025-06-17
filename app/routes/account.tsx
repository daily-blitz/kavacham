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
    const {data} = await customerAccount.query(
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
    
    return {customer: data?.customer};
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
      <div className="container-custom py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="flex justify-end mb-8"
          >
            <Logout />
          </motion.div>
          
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
                <Outlet context={{customer}} />
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
    { to: '/account', label: 'Overview', end: true },
    { to: '/account/orders', label: 'Orders' },
    { to: '/account/profile', label: 'Profile' },
    { to: '/account/addresses', label: 'Addresses' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
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
                `flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-md'
                }`
              }
            >
              {({isActive}) => (
                <>
                  <span>{item.label}</span>
                  <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </>
              )}
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign out
      </motion.button>
    </Form>
  );
}
