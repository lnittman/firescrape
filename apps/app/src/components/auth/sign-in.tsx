'use client';

import { useState, useEffect } from 'react';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import { Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { useAuth, useSignIn } from '@repo/auth/client';

import { AppleIcon } from '@/components/icons/apple-icon';
import { GoogleIcon } from '@/components/icons/google-icon';

export function CustomSignIn() {
    const router = useRouter();

    const { isSignedIn, isLoaded: authLoaded } = useAuth();
    const { signIn } = useSignIn();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Handle OAuth sign-in
    const signInWithOAuth = (strategy: 'oauth_google' | 'oauth_apple') => {
        if (!signIn) return;
        
        return signIn
            .authenticateWithRedirect({
                strategy,
                redirectUrl: '/sign-in/sso-callback',
                redirectUrlComplete: '/',
            })
            .catch((err) => {
                console.error('OAuth sign-in error:', err);
            });
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (authLoaded && isSignedIn) {
            router.push('/');
        }
    }, [authLoaded, isSignedIn, router]);

    useEffect(() => {
        // Wait for component to be fully mounted and Clerk to be ready
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleComplete = () => {
            router.push('/');
        };

        document.addEventListener('clerk:sign-in:complete', handleComplete);

        return () => {
            document.removeEventListener('clerk:sign-in:complete', handleComplete);
        };
    }, [router]);

    // Show nothing while redirecting authenticated users
    if (authLoaded && isSignedIn) {
        return null;
    }

    if (!isLoaded || !authLoaded) {
        return (
            <div className="w-full space-y-6 opacity-0">
                {/* Invisible placeholder to prevent layout shift */}
                <div className="text-center space-y-4">
                    <div className="h-20 w-full" /> {/* Logo placeholder */}
                </div>
                <div className="space-y-4">
                    <div className="h-10 w-full" /> {/* Social buttons placeholder */}
                    <div className="h-10 w-full" />
                    <div className="h-8 w-full" /> {/* Divider placeholder */}
                    <div className="h-10 w-full" /> {/* Email input placeholder */}
                    <div className="h-10 w-full" /> {/* Password input placeholder */}
                    <div className="h-10 w-full" /> {/* Submit button placeholder */}
                </div>
                <div className="h-4 w-full" /> {/* Footer placeholder */}
            </div>
        );
    }

    return (
        <motion.div 
            className="w-full space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Fire emoji centered above form */}
            <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <span className="text-4xl">🔥</span>
            </motion.div>

            <SignIn.Root routing="path" path="/sign-in">
                <SignIn.Step name="start">
                    <div className="space-y-4">
                        <Clerk.GlobalError className="block text-sm text-red-600 text-center" />

                        {/* Social Sign In */}
                        <div className="space-y-3">
                            <button
                                onClick={() => signInWithOAuth('oauth_apple')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border hover:border-foreground/20 hover:bg-accent/50 transition-all duration-200 text-sm rounded-lg h-10"
                            >
                                <AppleIcon className="w-4 h-4 text-foreground" />
                                Continue with Apple
                            </button>

                            <button
                                onClick={() => signInWithOAuth('oauth_google')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border hover:border-foreground/20 hover:bg-accent/50 transition-all duration-200 text-sm rounded-lg h-10"
                            >
                                <GoogleIcon className="w-4 h-4" />
                                Continue with Google
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-background px-3 text-muted-foreground ">
                                    or
                                </span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        <div className="space-y-4">
                            <Clerk.Field name="identifier">
                                <Clerk.Label className="block text-sm font-medium  text-foreground mb-2">
                                    Email
                                </Clerk.Label>
                                <Clerk.Input
                                    className="w-full h-10 px-3 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors rounded-lg"
                                    placeholder="user@example.com"
                                    style={{ fontSize: '16px' }} // Prevent zoom on iOS
                                />
                                <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                            </Clerk.Field>

                            <Clerk.Field name="password">
                                <div className="flex items-center justify-between mb-2">
                                    <Clerk.Label className="text-sm font-medium  text-foreground">
                                        Password
                                    </Clerk.Label>
                                    <SignIn.Action
                                        navigate="forgot-password"
                                        className="text-xs  text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Forgot password?
                                    </SignIn.Action>
                                </div>
                                <div className="relative">
                                    <Clerk.Input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full h-10 px-3 pr-10 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors rounded-lg"
                                        placeholder="••••••••"
                                        style={{ fontSize: '16px' }} // Prevent zoom on iOS
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeSlash size={16} weight="duotone" />
                                        ) : (
                                            <Eye size={16} weight="duotone" />
                                        )}
                                    </button>
                                </div>
                                <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                            </Clerk.Field>

                            <SignIn.Action
                                submit
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                            >
                                Sign In
                                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1">
                                    <ArrowRight size={14} weight="duotone" />
                                </span>
                            </SignIn.Action>
                        </div>
                    </div>
                </SignIn.Step>

                {/* Verification Step */}
                <SignIn.Step name="verifications">
                    <SignIn.Strategy name="email_code">
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h2 className="text-lg font-semibold ">Check your email</h2>
                                <p className="text-sm text-muted-foreground ">
                                    We sent a verification code to{' '}
                                    <span className="text-foreground">
                                        <SignIn.SafeIdentifier />
                                    </span>
                                </p>
                            </div>

                            <Clerk.Field name="code">
                                <Clerk.Label className="block text-sm font-medium  text-foreground mb-2">
                                    Verification Code
                                </Clerk.Label>
                                <Clerk.Input
                                    className="w-full h-10 px-3 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors text-center tracking-widest rounded-lg"
                                    placeholder="000000"
                                    style={{ fontSize: '16px' }} // Prevent zoom on iOS
                                />
                                <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                            </Clerk.Field>

                            <SignIn.Action
                                submit
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                            >
                                Verify
                                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                    <ArrowRight size={14} weight="duotone" />
                                </span>
                            </SignIn.Action>
                        </div>
                    </SignIn.Strategy>

                    <SignIn.Strategy name="password">
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h2 className="text-lg font-semibold ">Enter password</h2>
                                <p className="text-sm text-muted-foreground ">
                                    Please enter your password to continue
                                </p>
                            </div>

                            <Clerk.Field name="password">
                                <Clerk.Label className="block text-sm font-medium  text-foreground mb-2">
                                    Password
                                </Clerk.Label>
                                <div className="relative">
                                    <Clerk.Input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full h-10 px-3 pr-10 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors rounded-lg"
                                        placeholder="••••••••"
                                        style={{ fontSize: '16px' }} // Prevent zoom on iOS
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeSlash size={16} weight="duotone" />
                                        ) : (
                                            <Eye size={16} weight="duotone" />
                                        )}
                                    </button>
                                </div>
                                <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                            </Clerk.Field>

                            <SignIn.Action
                                submit
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                            >
                                Sign In
                                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                    <ArrowRight size={14} weight="duotone" />
                                </span>
                            </SignIn.Action>

                            <SignIn.Action
                                navigate="forgot-password"
                                className="w-full text-center text-xs  text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Forgot password?
                            </SignIn.Action>
                        </div>
                    </SignIn.Strategy>
                </SignIn.Step>

                {/* Forgot Password Step */}
                <SignIn.Step name="forgot-password">
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h2 className="text-lg font-semibold ">Reset password</h2>
                            <p className="text-sm text-muted-foreground ">
                                Enter your email to receive a reset link
                            </p>
                        </div>

                        <Clerk.Field name="identifier">
                            <Clerk.Label className="block text-sm font-medium  text-foreground mb-2">
                                Email
                            </Clerk.Label>
                            <Clerk.Input
                                className="w-full h-10 px-3 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors rounded-lg"
                                placeholder="user@example.com"
                                style={{ fontSize: '16px' }} // Prevent zoom on iOS
                            />
                            <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                        </Clerk.Field>

                        <SignIn.SupportedStrategy name="reset_password_email_code">
                            <SignIn.Action
                                submit
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                            >
                                Send reset link
                                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                    <ArrowRight size={14} weight="duotone" />
                                </span>
                            </SignIn.Action>
                        </SignIn.SupportedStrategy>

                        <SignIn.Action
                            navigate="start"
                            className="w-full text-center text-xs  text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Back to sign in
                        </SignIn.Action>
                    </div>
                </SignIn.Step>

                {/* Reset Password Step */}
                <SignIn.Step name="reset-password">
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h2 className="text-lg font-semibold ">New password</h2>
                            <p className="text-sm text-muted-foreground ">
                                Create a new password for your account
                            </p>
                        </div>

                        <Clerk.Field name="password">
                            <Clerk.Label className="block text-sm font-medium  text-foreground mb-2">
                                New Password
                            </Clerk.Label>
                            <div className="relative">
                                <Clerk.Input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full h-10 px-3 pr-10 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors rounded-lg"
                                    placeholder="••••••••"
                                    style={{ fontSize: '16px' }} // Prevent zoom on iOS
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeSlash size={16} weight="duotone" />
                                    ) : (
                                        <Eye size={16} weight="duotone" />
                                    )}
                                </button>
                            </div>
                            <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                        </Clerk.Field>

                        <Clerk.Field name="confirmPassword">
                            <Clerk.Label className="block text-sm font-medium  text-foreground mb-2">
                                Confirm Password
                            </Clerk.Label>
                            <Clerk.Input
                                type="password"
                                className="w-full h-10 px-3 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors rounded-lg"
                                placeholder="••••••••"
                                style={{ fontSize: '16px' }} // Prevent zoom on iOS
                            />
                            <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                        </Clerk.Field>

                        <SignIn.Action
                            submit
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                        >
                            Reset password
                            <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                <ArrowRight size={14} weight="duotone" />
                            </span>
                        </SignIn.Action>
                    </div>
                </SignIn.Step>
            </SignIn.Root>

            {/* Footer */}
            <div className="text-center">
                <p className="text-xs text-muted-foreground ">
                    Don't have an account?{' '}
                    <Link
                        href="/sign-up"
                        className="text-foreground hover:text-foreground/80 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </motion.div>
    );
} 