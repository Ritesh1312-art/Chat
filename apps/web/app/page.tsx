import { redirect } from 'next/navigation';

// Root page: redirect to home dashboard (AuthContext redirects to /login if unauthenticated)
export default function RootPage() {
  redirect('/home');
}
