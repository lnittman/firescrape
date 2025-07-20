"use client"

import * as React from "react"
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@repo/design"
import { cn } from '@repo/design/lib/utils';
import { CaretDown, MagnifyingGlass, X } from '@phosphor-icons/react/dist/ssr';

interface Country {
    name: string;
    code: string;
    flag: string;
    dialCode: string;
    continent: string;
}

// Country data organized by continent
const countries: Country[] = [
    // North America
    { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1', continent: 'North America' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1', continent: 'North America' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽', dialCode: '+52', continent: 'North America' },

    // Europe
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44', continent: 'Europe' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49', continent: 'Europe' },
    { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33', continent: 'Europe' },
    { name: 'Spain', code: 'ES', flag: '🇪🇸', dialCode: '+34', continent: 'Europe' },
    { name: 'Italy', code: 'IT', flag: '🇮🇹', dialCode: '+39', continent: 'Europe' },
    { name: 'Netherlands', code: 'NL', flag: '🇳🇱', dialCode: '+31', continent: 'Europe' },
    { name: 'Sweden', code: 'SE', flag: '🇸🇪', dialCode: '+46', continent: 'Europe' },
    { name: 'Norway', code: 'NO', flag: '🇳🇴', dialCode: '+47', continent: 'Europe' },
    { name: 'Denmark', code: 'DK', flag: '🇩🇰', dialCode: '+45', continent: 'Europe' },
    { name: 'Switzerland', code: 'CH', flag: '🇨🇭', dialCode: '+41', continent: 'Europe' },
    { name: 'Austria', code: 'AT', flag: '🇦🇹', dialCode: '+43', continent: 'Europe' },
    { name: 'Belgium', code: 'BE', flag: '🇧🇪', dialCode: '+32', continent: 'Europe' },
    { name: 'Portugal', code: 'PT', flag: '🇵🇹', dialCode: '+351', continent: 'Europe' },
    { name: 'Poland', code: 'PL', flag: '🇵🇱', dialCode: '+48', continent: 'Europe' },

    // Asia
    { name: 'Japan', code: 'JP', flag: '🇯🇵', dialCode: '+81', continent: 'Asia' },
    { name: 'South Korea', code: 'KR', flag: '🇰🇷', dialCode: '+82', continent: 'Asia' },
    { name: 'China', code: 'CN', flag: '🇨🇳', dialCode: '+86', continent: 'Asia' },
    { name: 'India', code: 'IN', flag: '🇮🇳', dialCode: '+91', continent: 'Asia' },
    { name: 'Singapore', code: 'SG', flag: '🇸🇬', dialCode: '+65', continent: 'Asia' },
    { name: 'Hong Kong', code: 'HK', flag: '🇭🇰', dialCode: '+852', continent: 'Asia' },
    { name: 'Taiwan', code: 'TW', flag: '🇹🇼', dialCode: '+886', continent: 'Asia' },
    { name: 'Thailand', code: 'TH', flag: '🇹🇭', dialCode: '+66', continent: 'Asia' },
    { name: 'Malaysia', code: 'MY', flag: '🇲🇾', dialCode: '+60', continent: 'Asia' },
    { name: 'Philippines', code: 'PH', flag: '🇵🇭', dialCode: '+63', continent: 'Asia' },
    { name: 'Indonesia', code: 'ID', flag: '🇮🇩', dialCode: '+62', continent: 'Asia' },
    { name: 'Vietnam', code: 'VN', flag: '🇻🇳', dialCode: '+84', continent: 'Asia' },

    // Oceania
    { name: 'Australia', code: 'AU', flag: '🇦🇺', dialCode: '+61', continent: 'Oceania' },
    { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', dialCode: '+64', continent: 'Oceania' },

    // South America
    { name: 'Brazil', code: 'BR', flag: '🇧🇷', dialCode: '+55', continent: 'South America' },
    { name: 'Argentina', code: 'AR', flag: '🇦🇷', dialCode: '+54', continent: 'South America' },
    { name: 'Chile', code: 'CL', flag: '🇨🇱', dialCode: '+56', continent: 'South America' },
    { name: 'Colombia', code: 'CO', flag: '🇨🇴', dialCode: '+57', continent: 'South America' },
    { name: 'Peru', code: 'PE', flag: '🇵🇪', dialCode: '+51', continent: 'South America' },

    // Africa
    { name: 'South Africa', code: 'ZA', flag: '🇿🇦', dialCode: '+27', continent: 'Africa' },
    { name: 'Nigeria', code: 'NG', flag: '🇳🇬', dialCode: '+234', continent: 'Africa' },
    { name: 'Kenya', code: 'KE', flag: '🇰🇪', dialCode: '+254', continent: 'Africa' },
    { name: 'Egypt', code: 'EG', flag: '🇪🇬', dialCode: '+20', continent: 'Africa' },
    { name: 'Morocco', code: 'MA', flag: '🇲🇦', dialCode: '+212', continent: 'Africa' },
];

// Group countries by continent
const continentOrder = ['North America', 'Europe', 'Asia', 'Oceania', 'South America', 'Africa'];

interface FlagPickerButtonProps {
    selectedCountry?: Country;
    onCountrySelect: (country: Country) => void;
    disabled?: boolean;
    className?: string;
}

export function FlagPickerButton({
    selectedCountry,
    onCountrySelect,
    disabled = false,
    className,
}: FlagPickerButtonProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    // Default to US if no country selected
    const displayCountry = selectedCountry || countries.find(c => c.code === 'US')!;

    // Filter countries based on search
    const filteredCountries = React.useMemo(() => {
        if (!searchQuery.trim()) return countries;

        const query = searchQuery.toLowerCase();
        return countries.filter(country =>
            country.name.toLowerCase().includes(query) ||
            country.code.toLowerCase().includes(query) ||
            country.dialCode.includes(query)
        );
    }, [searchQuery]);

    // Group filtered countries by continent
    const groupedCountries = React.useMemo(() => {
        const groups: Record<string, Country[]> = {};

        filteredCountries.forEach(country => {
            if (!groups[country.continent]) {
                groups[country.continent] = [];
            }
            groups[country.continent].push(country);
        });

        // Sort countries within each continent alphabetically
        Object.keys(groups).forEach(continent => {
            groups[continent].sort((a, b) => a.name.localeCompare(b.name));
        });

        return groups;
    }, [filteredCountries]);

    const handleCountrySelect = (country: Country) => {
        onCountrySelect(country);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "flex items-center gap-2 px-3 h-9 bg-background border border-border rounded-md hover:bg-accent transition-colors",
                        className
                    )}
                >
                    <span className="text-lg">{displayCountry.flag}</span>
                    <span className="text-sm font-mono text-muted-foreground">{displayCountry.dialCode}</span>
                    <CaretDown size={12} className="text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
                <div className="flex flex-col h-[400px]">
                    {/* Search bar */}
                    <div className="p-3 border-b border-border">
                        <div className="relative">
                            <MagnifyingGlass
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="text"
                                placeholder="Search countries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-9 py-2 text-sm font-mono bg-background border border-border rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Countries list */}
                    <div className="flex-1 overflow-y-auto">
                        {Object.keys(groupedCountries).length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-sm text-muted-foreground font-mono">
                                    No countries found
                                </p>
                            </div>
                        ) : (
                            continentOrder
                                .filter(continent => groupedCountries[continent]?.length > 0)
                                .map(continent => (
                                    <div key={continent} className="py-2">
                                        <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                                            {continent}
                                        </div>
                                        <div className="space-y-1 px-1">
                                            {groupedCountries[continent].map(country => (
                                                <button
                                                    key={country.code}
                                                    onClick={() => handleCountrySelect(country)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-2 py-2 text-left transition-colors rounded-md",
                                                        displayCountry.code === country.code
                                                            ? "bg-accent text-accent-foreground"
                                                            : "hover:bg-accent/50"
                                                    )}
                                                >
                                                    <span className="text-lg">{country.flag}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium truncate">
                                                            {country.name}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-mono text-muted-foreground">
                                                        {country.dialCode}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export { countries, continentOrder };
export type { Country };
