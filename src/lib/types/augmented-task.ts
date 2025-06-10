import type { Task } from '@prisma/client';

export type AugmentedTask = Task & { recurrent: string | undefined };
