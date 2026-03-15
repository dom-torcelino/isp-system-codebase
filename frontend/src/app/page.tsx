// 'use client';

// import AppRoot from '@/components/AppRoot';

// export default function Page() {
//   return <AppRoot />;
// }


// Why: No 'use client' directive. This executes securely and instantly on the server.
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Why: The base URL automatically points users to the main dashboard module.
  redirect('/overview');
}