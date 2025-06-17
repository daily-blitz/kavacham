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
                formatted
                city
                countryCode
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
    <div className="space-y-8">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-8">Account Overview</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Recent Orders"
            value={recentOrders.length.toString()}
            description="Orders in the last 30 days"
            href="/account/orders"
            index={0}
          />
          
          <DashboardCard
            title="Profile"
            value={customer?.firstName || "Not set"}
            description="Manage your personal information"
            href="/account/profile"
            index={1}
          />
          
          <DashboardCard
            title="Addresses"
            value={customer?.defaultAddress ? "Set" : "Not set"}
            description="Manage shipping addresses"
            href="/account/addresses"
            index={2}
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
}: {
  title: string;
  value: string;
  description: string;
  href: string;
  index: number;
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
        className="block p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-200/50 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">
              {title}
            </h3>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
        
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100/30 to-transparent rounded-full blur-xl group-hover:w-32 group-hover:h-32 transition-all duration-700 opacity-50" />
      </Link>
    </motion.div>
  );
}
