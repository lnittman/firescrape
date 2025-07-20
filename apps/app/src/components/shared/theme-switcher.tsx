"use client";

import React from "react";
import { Moon, Sun, Desktop } from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "@repo/design/components/ui/tabs";
import { cn } from "@repo/design/lib/utils";

export function ThemeSwitcher() {
    const { setTheme: setNextTheme, theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Ensure we only render after hydration to prevent SSR mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until mounted (prevents hydration mismatch)
    if (!mounted) {
        return (
            <div className="w-fit">
                <div className="bg-background border border-border w-fit h-8 p-0.5 rounded-lg flex items-center">
                    <div className="grid grid-cols-3 gap-0.5 h-full">
                        <div className="h-full w-7 rounded-md bg-muted" />
                        <div className="h-full w-7 rounded-md bg-muted" />
                        <div className="h-full w-7 rounded-md bg-muted" />
                    </div>
                </div>
            </div>
        );
    }

    const handleThemeChange = (value: string) => {
        setNextTheme(value);
    };

    return (
        <Tabs
            value={theme}
            onValueChange={handleThemeChange}
            className="w-fit"
        >
            <TabsList className="bg-background border border-border w-fit h-8 p-0.5 grid grid-cols-3 gap-0.5 rounded-lg">
                <TabsTrigger
                    value="light"
                    className="h-full w-7 px-0 transition-all duration-200 hover:text-foreground focus:outline-none flex items-center justify-center rounded-md data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border text-muted-foreground"
                    title="Light theme"
                >
                    <Sun
                        weight="duotone"
                        className="h-3.5 w-3.5"
                    />
                </TabsTrigger>
                <TabsTrigger
                    value="dark"
                    className="h-full w-7 px-0 transition-all duration-200 hover:text-foreground focus:outline-none flex items-center justify-center rounded-md data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border text-muted-foreground"
                    title="Dark theme"
                >
                    <Moon
                        weight="duotone"
                        className="h-3.5 w-3.5"
                    />
                </TabsTrigger>
                <TabsTrigger
                    value="system"
                    className="h-full w-7 px-0 transition-all duration-200 hover:text-foreground focus:outline-none flex items-center justify-center rounded-md data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border text-muted-foreground"
                    title="System theme"
                >
                    <Desktop
                        weight="duotone"
                        className="h-3.5 w-3.5"
                    />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
} 