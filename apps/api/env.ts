import { createEnv } from '@t3-oss/env-nextjs';

import { keys as core } from '@repo/next-config/keys';
import { keys as database } from '@repo/database/keys';
import { keys as security } from '@repo/security/keys';
import { keys as webhooks } from '@repo/webhooks/keys';

export const env = createEnv({
  extends: [
    core(),
    database(),
    security(),
    webhooks(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
