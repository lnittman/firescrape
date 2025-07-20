import type { NextConfig } from 'next';

import { withToolbar } from '@repo/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@repo/next-config';

import { env } from './env';

let nextConfig: NextConfig = withToolbar(config);

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
