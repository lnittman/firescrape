'use client';

import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Link as LinkTransition } from 'next-view-transitions';
import {
    User,
    Database,
    Brain,
    MagnifyingGlass,
    X
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@repo/design/lib/utils';

// Define subsections for each main section
const settingsData = [
    {
        title: 'General',
        href: '/settings/general',
        icon: User,
        description: 'Personal information and preferences',
        subsections: [
            'Profile',
            'Account',
            'Email',
            'Username',
            'Personal Information'
        ]
    },
    {
        title: 'AI Settings',
        href: '/settings/ai',
        icon: Brain,
        description: 'Configure AI extraction rules',
        subsections: [
            'Custom Rules',
            'Extraction Preferences'
        ]
    },
    {
        title: 'Data & Privacy',
        href: '/settings/data',
        icon: Database,
        description: 'Export or delete your data',
        subsections: [
            'Export Data',
            'Delete Account',
            'Privacy Settings',
            'Data Usage',
            'Storage'
        ]
    },
];

export const settingsNavigation = settingsData;

interface SettingsNavigationProps {
    /**
     * When true, highlight the General tab when the user is on
     * the root `/account/settings` page. Mobile views of the root
     * page should pass `false` so no tab is active.
     */
    rootActive?: boolean;
}

export function SettingsNavigation({ rootActive = false }: SettingsNavigationProps) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter settings based on search query
    const filteredSettings = useMemo(() => {
        if (!searchQuery.trim()) {
            return settingsData;
        }

        const query = searchQuery.toLowerCase();

        return settingsData.filter(item => {
            // Check if main title matches
            const titleMatch = item.title.toLowerCase().includes(query);

            // Check if any subsection matches
            const subsectionMatch = item.subsections.some(sub =>
                sub.toLowerCase().includes(query)
            );

            // Check if description matches
            const descriptionMatch = item.description.toLowerCase().includes(query);

            return titleMatch || subsectionMatch || descriptionMatch;
        });
    }, [searchQuery]);

    // Show subsections when searching
    const shouldShowSubsections = searchQuery.trim().length > 0;

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="px-4 py-4">
                <div className="relative">
                    <MagnifyingGlass
                        size={16}
                        weight="duotone"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className={cn(
                            "w-full pl-9 pr-9 py-2 text-sm font-mono",
                            "bg-muted/50 border border-border rounded-lg",
                            "placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
                            "transition-colors"
                        )}
                        style={{ fontSize: '16px' }}
                    />
                    {/* Clear button with fade animation */}
                    <button
                        onClick={handleClearSearch}
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2",
                            "text-muted-foreground hover:text-foreground",
                            "transition-all duration-200",
                            searchQuery ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                        )}
                        aria-label="Clear search"
                    >
                        <X size={14} weight="duotone" />
                    </button>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-1 px-4 pt-0 overflow-y-auto">
                {filteredSettings.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-mono px-3 py-2">
                        No settings found
                    </p>
                ) : (
                    filteredSettings.map((item) => {
                        // For General settings, active on the explicit page and
                        // optionally on the root settings page depending on
                        // the `rootActive` prop. Mobile views of the root page
                        // pass `false` so the item is not highlighted.
                        const isActive = item.title === 'General'
                            ? pathname === '/settings/general' || (rootActive && pathname === '/settings')
                            : pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <div key={item.href}>
                                <LinkTransition
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                        "hover:bg-accent/50",
                                        isActive
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon
                                        size={18}
                                        weight="duotone"
                                        className="shrink-0"
                                    />
                                    <span className="font-mono">{item.title}</span>
                                </LinkTransition>

                                {/* Show subsections when searching */}
                                {shouldShowSubsections && (
                                    <div className="ml-7 mt-1 space-y-1">
                                        {item.subsections
                                            .filter(sub =>
                                                sub.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map((subsection) => (
                                                <LinkTransition
                                                    key={`${item.href}-${subsection}`}
                                                    href={item.href}
                                                    className="block px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                                                >
                                                    {subsection}
                                                </LinkTransition>
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </nav>
        </div>
    );
} 