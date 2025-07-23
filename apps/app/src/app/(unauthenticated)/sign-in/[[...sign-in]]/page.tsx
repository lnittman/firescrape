import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { CustomSignIn } from '@/components/auth/sign-in';

const title = 'Sign In';
const description = 'Turn any URL into clean, structured data with Firescrape.';

export const metadata: Metadata = createMetadata({ title, description });

export default function SignInPage() {
  return <CustomSignIn />;
}
