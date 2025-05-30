import { Hono } from 'hono';
import { db } from '@/db/drizzle';
import {
  categories,
  transactions as transactionsTable,
  transactionsInsertSchema,
  accounts,
} from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import {
  and,
  eq,
  gte,
  inArray,
  lte,
  desc,
  notInArray,
  sql,
} from 'drizzle-orm';
import { parse, subDays } from 'date-fns';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        accountId: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { accountId, from, to } = c.req.valid('query');

      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);
      const startDate = from
        ? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, 'yyyy-MM-dd', new Date())
        : defaultTo;

      const transactions = await db
        .select({
          id: transactionsTable.id,
          date: transactionsTable.date,
          category: categories.name,
          categoryId: transactionsTable.categoryId,
          payee: transactionsTable.payee,
          amount: transactionsTable.amount,
          notes: transactionsTable.notes,
          account: accounts.name,
          accountId: transactionsTable.accountId,
        })
        .from(transactionsTable)
        .innerJoin(
          accounts,
          eq(transactionsTable.accountId, accounts.id)
        )
        .leftJoin(
          categories,
          eq(transactionsTable.categoryId, categories.id)
        )
        .where(
          and(
            accountId
              ? eq(transactionsTable.accountId, accountId)
              : undefined,
            eq(accounts.userId, auth.userId!),
            gte(transactionsTable.date, startDate),
            lte(transactionsTable.date, endDate)
          )
        )
        .orderBy(desc(transactionsTable.date));

      return c.json({ transactions });
    }
  )
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
      const transaction = await db
        .select({
          id: transactionsTable.id,
          date: transactionsTable.date,
          categoryId: transactionsTable.categoryId,
          payee: transactionsTable.payee,
          amount: transactionsTable.amount,
          notes: transactionsTable.notes,
          accountId: transactionsTable.accountId,
        })
        .from(transactionsTable)
        .innerJoin(
          accounts,
          eq(transactionsTable.accountId, accounts.id)
        )
        .where(
          and(
            eq(transactionsTable.id, id),
            eq(accounts.userId, auth.userId!)
          )
        );
      if (transaction.length === 0) {
        return c.json({ error: 'Transaction not found' }, 404);
      }
      return c.json({ transaction: transaction[0] });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', transactionsInsertSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const values = c.req.valid('json');
      const [transaction] = await db
        .insert(transactionsTable)
        .values({
          id: createId(),
          ...values,
        })
        .returning();
      return c.json({ transaction });
    }
  )
  .post(
    '/bulk-create',
    clerkMiddleware(),
    zValidator('json', z.array(transactionsInsertSchema.omit({ id: true }))),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const values = c.req.valid('json');
      const transactions = await db
        .insert(transactionsTable)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();
      return c.json({ transactions });
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
      const transactionsToDelete = db
        .$with('transactions_to_delete')
        .as(
          db
            .select({ id: transactionsTable.id })
            .from(transactionsTable)
            .innerJoin(
              accounts,
              eq(transactionsTable.accountId, accounts.id)
            )
            .where(
              and(
                inArray(transactionsTable.id, ids),
                eq(accounts.userId, auth.userId!)
              )
            )
        );

      await db
        .with(transactionsToDelete)
        .delete(transactionsTable)
        .where(
          notInArray(
            transactionsTable.id,
            sql`(select id from ${transactionsToDelete})`
          )
        );

      return c.json({ message: 'Transactions deleted' });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', transactionsInsertSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');
      if (!id) {
        return c.json({ error: 'Id is required' }, 400);
      }

      const transactionsToUpdate = db
        .$with('transactions_to_update')
        .as(
          db
            .select({ id: transactionsTable.id })
            .from(transactionsTable)
            .innerJoin(
              accounts,
              eq(transactionsTable.accountId, accounts.id)
            )
            .where(
              and(
                eq(transactionsTable.id, id),
                eq(accounts.userId, auth.userId!)
              )
            )
        );

      const [transaction] = await db
        .with(transactionsToUpdate)
        .update(transactionsTable)
        .set(values)
        .where(
          notInArray(
            transactionsTable.id,
            sql`(select id from ${transactionsToUpdate})`
          )
        )
        .returning();

      if (!transaction) {
        return c.json({ error: 'Transaction not found' }, 404);
      }

      return c.json({ transaction });
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

      const transactionsToDelete = db
        .$with('transactions_to_delete')
        .as(
          db
            .select({ id: transactionsTable.id })
            .from(transactionsTable)
            .innerJoin(
              accounts,
              eq(transactionsTable.accountId, accounts.id)
            )
            .where(
              and(
                eq(transactionsTable.id, id),
                eq(accounts.userId, auth.userId!)
              )
            )
        );
      const [transaction] = await db
        .with(transactionsToDelete)
        .delete(transactionsTable)
        .where(
          notInArray(
            transactionsTable.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning();

      if (!transaction) {
        return c.json({ error: 'Transaction not found' }, 404);
      }
      return c.json({ transaction });
    }
  );

export default app;
