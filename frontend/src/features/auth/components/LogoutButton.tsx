import { logoutAction } from '@/actions/auth';

export function LogoutButton() {
  // Why: Using a form with a server action ensures the logout is a POST request, mitigating CSRF, and functions without requiring client-side JavaScript.
  return (
    <form action={logoutAction}>
      <button 
        type="submit" 
        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}