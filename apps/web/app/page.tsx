import { redirect } from 'next/navigation';

// Root page: immediately redirect to login
// AuthContext will redirect to /zone-b if already logged in
export default function RootPage() {
  redirect('/login');
}
