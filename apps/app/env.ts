import { createEnv } from '@t3-oss/env-nextjs';

import { keys as auth } from '@repo/auth/keys';
import { keys as core } from '@repo/next-config/keys';

export const env = createEnv({
  extends: [
    auth(),
    core(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
