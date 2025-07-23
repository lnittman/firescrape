import { redirect } from 'next/navigation';

export default async function AccountPage() {
    // Redirect to settings since we don't have a separate account page
    redirect('/settings');
} 