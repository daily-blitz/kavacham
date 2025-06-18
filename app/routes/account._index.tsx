import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from 'react-router';
import {motion} from 'framer-motion';

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccount = context.customerAccount;
  
  try {
    const [customer, orders] = await Promise.all([
      customerAccount.query(
        `#graphql
          query CustomerDashboard {
            customer {
              id
              firstName
              lastName
              defaultAddress {
                id
                formatted
                city
                countryCode
              }
              addresses(first: 10) {
                nodes {
                  id
                }
              }
            }
          }
        `
      ),
      customerAccount.query(
        `#graphql
          query RecentOrders {
            customer {
              orders(first: 3, sortKey: PROCESSED_AT, reverse: true) {
                nodes {
                  id
                  name
                  processedAt
                  totalPrice {
                    amount
                    currencyCode
                  }
                  fulfillmentStatus
                }
              }
            }
          }
        `
      )
    ]);
    
    return {customer, orders};
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      return customerAccount.login();
    }
    throw error;
  }
}

export default function AccountDashboard() {
  const {customer, orders} = useLoaderData<typeof loader>();
  const recentOrders = orders?.customer?.orders?.nodes || [];

  if (!customer) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 text-white relative">
          <div className="relative z-10">
            <motion.div
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.2}}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Welcome back, {customer?.firstName || 'Valued Customer'}! 👋
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                Manage your orders, update your profile, and track your shopping journey all in one place.
              </p>
            </motion.div>
            
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.4}}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link 
                to="/collections"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                to="/account/orders"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <span className="text-white">View Orders</span>
              </Link>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl" />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.2}}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Overview</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Order History"
            value={recentOrders.length.toString()}
            description="Total orders placed"
            href="/account/orders"
            index={0}
            icon="📦"
          />
          
          <DashboardCard
            title="Profile Settings"
            value={customer?.firstName && customer?.lastName ? "Complete" : "Incomplete"}
            description="Personal information status"
            href="/account/profile"
            index={1}
            icon="👤"
          />
          
          <DashboardCard
            title="Shipping Addresses"
            value={customer?.addresses?.nodes?.length > 0 ? `${customer.addresses.nodes.length} Saved` : "None"}
            description="Saved delivery locations"
            href="/account/addresses"
            index={2}
            icon="📍"
          />
        </div>
      </motion.div>

      {recentOrders.length > 0 && (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.3}}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
            <Link 
              to="/account/orders"
              className="inline-flex items-center gap-2 text-sm text-black hover:text-gray-700 font-medium transition-colors duration-300 group"
            >
              View all orders
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200/50"
              >
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">{order.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.processedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">
                    {order.totalPrice.currencyCode} {order.totalPrice.amount}
                  </p>
                  <p className="text-sm text-gray-600 capitalize mt-1">
                    {order.fulfillmentStatus?.toLowerCase() || 'Processing'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  href,
  index,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  href: string;
  index: number;
  icon?: string;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: index * 0.1}}
      whileHover={{y: -8, transition: {duration: 0.2}}}
      className="group"
    >
      <Link 
        to={href}
        className="block p-8 bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {icon && (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{icon}</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-black transition-colors duration-300 text-lg">
                  {title}
                </h3>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-black group-hover:to-gray-800 transition-all duration-300">
              {value}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100/20 to-transparent rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-700 opacity-50" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-50/30 to-transparent rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-700" />
      </Link>
    </motion.div>
  );
}
