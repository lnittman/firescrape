'use client';

import React from 'react';
import { FlagPickerButton, type Country } from '@/components/shared/ui/flag-picker-button';
import { MobileCountryPickerMenu } from '@/components/shared/menu/mobile-country-picker-menu';
import { useIsMobile } from '@repo/design/hooks/use-mobile';

interface PhoneNumberSectionProps {
    value: string;
    onChange: (value: string) => void;
    selectedCountry?: Country;
    onCountrySelect: (country: Country) => void;
}

export function PhoneNumberSection({
    value,
    onChange,
    selectedCountry,
    onCountrySelect
}: PhoneNumberSectionProps) {
    const isMobile = useIsMobile();
    const handlePhoneChange = (phoneInput: string) => {
        const phone = phoneInput ? `${selectedCountry?.dialCode || '+1'}${phoneInput}` : '';
        onChange(phone);
    };

    return (
        <div className="border border-border rounded-lg">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium font-mono">Your Phone Number</label>
                    <p className="text-sm text-muted-foreground">
                        Enter a phone number to receive important service updates by SMS.
                    </p>
                    <div className="flex gap-2">
                        {isMobile ? (
                            <MobileCountryPickerMenu
                                selectedCountry={selectedCountry}
                                onSelect={onCountrySelect}
                            />
                        ) : (
                            <FlagPickerButton
                                selectedCountry={selectedCountry}
                                onCountrySelect={onCountrySelect}
                            />
                        )}
                        <input
                            type="tel"
                            value={value.replace(/^\+\d+/, '') || ''}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="(201) 555-0123"
                            className="flex-1 h-9 px-3 bg-background border border-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors"
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    A code will be sent to verify
                </p>
            </div>
        </div>
    );
} 