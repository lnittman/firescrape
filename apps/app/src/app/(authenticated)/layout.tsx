import { auth, currentUser } from '@repo/auth/server';
import { secure } from '@repo/security';
import { redirect } from 'next/navigation';

import { env } from '../../../env';
import { ClientLayout } from '@/app/(authenticated)/client-layout';
import { SWRProvider } from '@/lib/swr/provider';

import type { ReactNode } from 'react';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

// Font initialization script that runs before React hydration
const fontInitScript = `
  (function() {
    var savedFont = null;
    try {
      savedFont = localStorage.getItem('preferred-font');
    } catch (e) {}
    if (savedFont) {
      const fontClasses = {
        'iosevka-term': 'font-iosevka-term',
        'geist-mono': 'font-geist-mono',
        'jetbrains-mono': 'font-jetbrains-mono',
        'fira-code': 'font-fira-code',
        'commit-mono': 'font-commit-mono',
        'departure-mono': 'font-departure-mono',
        'fragment-mono': 'font-fragment-mono',
        'server-mono': 'font-server-mono',
        'sfmono-square': 'font-sfmono-square',
        'tx02-mono': 'font-tx02-mono'
      };
      const className = fontClasses[savedFont];
      if (className) {
        document.documentElement.classList.add(className);
      }
    }
  })();
`;

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    return redirectToSignIn();
  }

  // Prefetch common data for all authenticated pages
  // This data will be cached and used by SWR
  const fallback = {};

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: fontInitScript }} />
      <SWRProvider fallback={fallback}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </SWRProvider>
    </>
  );
};

export default AppLayout;
