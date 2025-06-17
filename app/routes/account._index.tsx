import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from 'react-router';

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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Recent Orders"
            value={recentOrders.length.toString()}
            description="Orders in the last 30 days"
            icon="📦"
            href="/account/orders"
          />
          
          <DashboardCard
            title="Profile"
            value={customer?.firstName || "Not set"}
            description="Manage your personal information"
            icon="👤"
            href="/account/profile"
          />
          
          <DashboardCard
            title="Addresses"
            value={customer?.defaultAddress ? "Set" : "Not set"}
            description="Manage shipping addresses"
            icon="📍"
            href="/account/addresses"
          />
        </div>
      </div>

      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link 
              to="/account/orders"
              className="text-sm text-black hover:underline font-medium"
            >
              View all orders →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.processedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {order.totalPrice.currencyCode} {order.totalPrice.amount}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {order.fulfillmentStatus?.toLowerCase() || 'Processing'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  href,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <Link 
      to={href}
      className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-medium text-gray-900 group-hover:text-black">
          {title}
        </h3>
      </div>
      <p className="text-lg font-semibold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
