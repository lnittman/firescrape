import { ViewTransitions } from 'next-view-transitions';
import { SettingsNavigation } from '@/components/settings/settings-navigation';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ViewTransitions>
            <div className="relative flex min-h-screen">
                    {/* Settings Sidebar - hidden on mobile when viewing a settings page */}
                <div className="hidden sm:block fixed top-0 left-0 h-screen w-72 border-r border-border bg-background/50 backdrop-blur-xl z-10 pt-[93px]">
                        <div className="flex h-full flex-col overflow-y-auto">
                            <SettingsNavigation rootActive />
                        </div>
                    </div>

                {/* Content Area - full width on mobile, offset for sidebar on desktop */}
                <div className="flex-1 max-w-4xl relative z-0 sm:ml-72">
                    <main>
                            {children}
                    </main>
                </div>
            </div>
        </ViewTransitions>
    );
} 