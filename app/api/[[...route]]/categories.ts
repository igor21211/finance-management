import { Hono } from 'hono';
import { db } from '@/db/drizzle';
import { categories as categoriesTable } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { categoriesInsertSchema } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.userId, auth.userId!));

    return c.json({ categories });
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
      const category = await db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
        })
        .from(categoriesTable)
        .where(
          and(
            eq(categoriesTable.id, id),
            eq(categoriesTable.userId, auth.userId!)
          )
        );
      if (category.length === 0) {
        return c.json({ error: 'Category not found' }, 404);
      }
      return c.json({ category: category[0] });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', categoriesInsertSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const { name } = c.req.valid('json');
      const [category] = await db
        .insert(categoriesTable)
        .values({
          id: createId(),
          name,
          userId: auth.userId!,
        })
        .returning();
      return c.json({ category });
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
        .delete(categoriesTable)
        .where(
          and(
            eq(categoriesTable.userId, auth.userId!),
            inArray(categoriesTable.id, ids)
          )
        )
        .returning({ id: categoriesTable.id });
      return c.json({ message: 'Categories deleted' });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', categoriesInsertSchema.pick({ name: true })),
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
      const [category] = await db
        .update(categoriesTable)
        .set({ name })
        .where(
          and(
            eq(categoriesTable.id, id),
            eq(categoriesTable.userId, auth.userId!)
          )
        )
        .returning();
      return c.json({ category });
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
      const [category] = await db
        .delete(categoriesTable)
        .where(
          and(
            eq(categoriesTable.id, id),
            eq(categoriesTable.userId, auth.userId!)
          )
        )
        .returning({ id: categoriesTable.id });

      if (!category) {
        return c.json({ error: 'Category not found' }, 404);
      }
      return c.json({ category });
    }
  );

export default app;
