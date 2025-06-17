import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.login();
}

export default function Login() {
  return null;
}