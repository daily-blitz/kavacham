import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
        <p className="text-sm text-gray-600">
          {orders.nodes.length} {orders.nodes.length === 1 ? 'order' : 'orders'}
        </p>
      </div>
      
      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </div>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <div className="space-y-4">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <span className="text-6xl">📦</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-600 mb-6">
        You haven't placed any orders yet. Start shopping to see your orders here.
      </p>
      <Link 
        to="/collections"
        className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Start Shopping →
      </Link>
    </div>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link 
              to={`/account/orders/${btoa(order.id)}`}
              className="text-lg font-semibold text-gray-900 hover:text-black"
            >
              Order #{order.number}
            </Link>
            {fulfillmentStatus && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fulfillmentStatus)}`}>
                {fulfillmentStatus}
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
            <span>📅 {new Date(order.processedAt).toLocaleDateString()}</span>
            <span>💳 {order.financialStatus}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <Money data={order.totalPrice} className="text-lg font-semibold text-gray-900" />
          </div>
          <Link 
            to={`/account/orders/${btoa(order.id)}`}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
