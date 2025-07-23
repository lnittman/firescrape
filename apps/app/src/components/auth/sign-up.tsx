'use client';

import { useState, useEffect } from 'react';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { useAuth, useSignUp } from '@repo/auth/client';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import { Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { AppleIcon, GoogleIcon } from '@/components/icons';

export function CustomSignUp() {
    const router = useRouter();
    const { isSignedIn, isLoaded: authLoaded } = useAuth();
    const { signUp } = useSignUp();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Handle OAuth sign-up
    const signUpWithOAuth = (strategy: 'oauth_google' | 'oauth_apple') => {
        if (!signUp) return;
        
        return signUp
            .authenticateWithRedirect({
                strategy,
                redirectUrl: '/sign-in/sso-callback',
                redirectUrlComplete: '/',
            })
            .catch((err) => {
                console.error('OAuth sign-up error:', err);
            });
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (authLoaded && isSignedIn) {
            router.push('/');
        }
    }, [authLoaded, isSignedIn, router]);

    useEffect(() => {
        // Wait for component to be fully mounted and ready
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

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
                    <div className="h-10 w-full" /> {/* Confirm password placeholder */}
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

            <SignUp.Root>
                <SignUp.Step name="start">
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        {/* Social Sign Up */}
                        <div className="space-y-3">
                            <button
                                onClick={() => signUpWithOAuth('oauth_apple')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border hover:border-foreground/20 hover:bg-accent/50 transition-all duration-200  text-sm rounded-lg h-10"
                            >
                                <AppleIcon className="w-4 h-4 text-foreground" />
                                Continue with Apple
                            </button>

                            <button
                                onClick={() => signUpWithOAuth('oauth_google')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border hover:border-foreground/20 hover:bg-accent/50 transition-all duration-200  text-sm rounded-lg h-10"
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
                            <Clerk.Field name="emailAddress">
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

                            <Clerk.Field name="confirmPassword">
                                <Clerk.Label className="block text-sm font-medium  text-foreground mb-2">
                                    Confirm Password
                                </Clerk.Label>
                                <div className="relative">
                                    <Clerk.Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="w-full h-10 px-3 pr-10 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20  text-sm transition-colors rounded-lg"
                                        placeholder="••••••••"
                                        style={{ fontSize: '16px' }} // Prevent zoom on iOS
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlash size={16} weight="duotone" />
                                        ) : (
                                            <Eye size={16} weight="duotone" />
                                        )}
                                    </button>
                                </div>
                                <Clerk.FieldError className="text-red-600 text-xs  mt-1" />
                            </Clerk.Field>

                            {/* CAPTCHA will be handled automatically by Clerk as invisible CAPTCHA */}

                            <SignUp.Action
                                submit
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                            >
                                Create account
                                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1">
                                    <ArrowRight size={14} weight="duotone" />
                                </span>
                            </SignUp.Action>
                        </div>
                    </motion.div>
                </SignUp.Step>

                {/* Verification Step */}
                <SignUp.Step name="verifications">
                    <SignUp.Strategy name="email_code">
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h2 className="text-lg font-semibold ">Check your email</h2>
                                <p className="text-sm text-muted-foreground ">
                                    We sent a verification code to your email address
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

                            <SignUp.Action
                                submit
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                            >
                                Verify email
                                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1">
                                    <ArrowRight size={14} weight="duotone" />
                                </span>
                            </SignUp.Action>

                            <SignUp.Action
                                navigate="start"
                                className="w-full text-center text-xs  text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Back to sign up
                            </SignUp.Action>
                        </div>
                    </SignUp.Strategy>

                    <SignUp.Strategy name="phone_code">
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h2 className="text-lg font-semibold ">Check your phone</h2>
                                <p className="text-sm text-muted-foreground ">
                                    We sent a verification code to your phone
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

                            <SignUp.Action
                                submit
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors  text-sm rounded-lg h-10 group"
                            >
                                Verify phone
                                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-1">
                                    <ArrowRight size={14} weight="duotone" />
                                </span>
                            </SignUp.Action>

                            <SignUp.Action
                                navigate="start"
                                className="w-full text-center text-xs  text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Back to sign up
                            </SignUp.Action>
                        </div>
                    </SignUp.Strategy>
                </SignUp.Step>
            </SignUp.Root>

            {/* Footer */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <p className="text-xs text-muted-foreground ">
                    Already have an account?{' '}
                    <Link
                        href="/sign-in"
                        className="text-foreground hover:text-foreground/80 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
} 