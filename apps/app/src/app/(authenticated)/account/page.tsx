import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { AccountOverviewNavigation } from '@/components/account/account-overview-navigation';

export default async function AccountPage() {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    // Check if desktop based on user agent (rough detection)
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

    // On desktop, redirect to spaces tab
    if (!isMobile) {
        redirect('/account/spaces');
    }

    return (
        <>
            {/* Mobile only: Show navigation menu */}
            <div className="block sm:hidden">
                <AccountOverviewNavigation />
            </div>
        </>
    );
} 