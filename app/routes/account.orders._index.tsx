import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta: MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer};
}

export default function Orders() {
  const {customer} = useLoaderData<{customer: CustomerOrdersFragment}>();
  const {orders} = customer;
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">Order History</h2>
          <p className="text-gray-600">Track and manage all your orders in one place.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">
            {orders.nodes.length}
          </p>
        </div>
      </motion.div>
      
      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </div>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6, delay: 0.2}}
      className="space-y-4"
    >
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order, index}) => <OrderItem key={order.id} order={order} index={index} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders />
      )}
    </motion.div>
  );
}

function EmptyOrders() {
  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.6}}
      className="text-center py-16"
    >
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
          <span className="text-4xl">📦</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        You haven't placed any orders yet. Start shopping to see your orders here.
      </p>
      <motion.div
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
      >
        <Link 
          to="/collections"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
        >
          Start Shopping
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function OrderItem({order, index}: {order: OrderItemFragment; index: number}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return 'bg-green-100/80 text-green-800 border-green-200/50';
      case 'pending':
        return 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50';
      case 'cancelled':
        return 'bg-red-100/80 text-red-800 border-red-200/50';
      default:
        return 'bg-gray-100/80 text-gray-800 border-gray-200/50';
    }
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: index * 0.1}}
      className="group bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Link 
                to={`/account/orders/${btoa(order.id)}`}
                className="text-xl font-bold text-gray-900 hover:text-black transition-colors duration-300 group-hover:scale-105 transform origin-left"
              >
                Order #{order.number}
              </Link>
              {fulfillmentStatus && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getStatusColor(fulfillmentStatus)}`}>
                  {fulfillmentStatus}
                </span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs">📅</span>
                </div>
                <span className="font-medium">{new Date(order.processedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs">💳</span>
                </div>
                <span className="font-medium capitalize">{order.financialStatus}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <Money data={order.totalPrice} className="text-2xl font-bold text-gray-900" />
            </div>
            <motion.div
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              <Link 
                to={`/account/orders/${btoa(order.id)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200/50"
              >
                View Details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100/20 to-transparent rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-700 opacity-50" />
    </motion.div>
  );
}
