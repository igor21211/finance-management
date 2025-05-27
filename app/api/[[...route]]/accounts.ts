import { Hono } from 'hono';
import { db } from '@/db/drizzle';
import { accounts as accountsTable } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { accountsInsertSchema } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const accounts = await db
      .select({
        id: accountsTable.id,
        name: accountsTable.name,
      })
      .from(accountsTable)
      .where(eq(accountsTable.userId, auth.userId!));

    return c.json({ accounts });
  })
  .get(
    '/:id',
    zValidator('param', z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const { id } = c.req.valid('param');
      if (!id) {
        return c.json({ error: 'Id is required' }, 400);
      }
      const account = await db
        .select({
          id: accountsTable.id,
          name: accountsTable.name,
        })
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.id, id),
            eq(accountsTable.userId, auth.userId!)
          )
        );
      if (account.length === 0) {
        return c.json({ error: 'Account not found' }, 404);
      }
      return c.json({ account: account[0] });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', accountsInsertSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const { name } = c.req.valid('json');
      const [account] = await db
        .insert(accountsTable)
        .values({
          id: createId(),
          name,
          userId: auth.userId!,
        })
        .returning();
      return c.json({ account });
    }
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const { ids } = c.req.valid('json');
      await db
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.userId, auth.userId!),
            inArray(accountsTable.id, ids)
          )
        )
        .returning({ id: accountsTable.id });
      return c.json({ message: 'Accounts deleted' });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', accountsInsertSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const { id } = c.req.valid('param');
      if (!id) {
        return c.json({ error: 'Id is required' }, 400);
      }
      const { name } = c.req.valid('json');
      const [account] = await db
        .update(accountsTable)
        .set({ name })
        .where(
          and(
            eq(accountsTable.id, id),
            eq(accountsTable.userId, auth.userId!)
          )
        )
        .returning();
      return c.json({ account });
    }
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const { id } = c.req.valid('param');
      if (!id) {
        return c.json({ error: 'Id is required' }, 400);
      }
      const [account] = await db
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.id, id),
            eq(accountsTable.userId, auth.userId!)
          )
        )
        .returning({ id: accountsTable.id });

      if (!account) {
        return c.json({ error: 'Account not found' }, 404);
      }
      return c.json({ account });
    }
  );

export default app;
