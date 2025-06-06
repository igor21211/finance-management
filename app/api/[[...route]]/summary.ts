import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { and, eq, gte, lt, lte, sql, sum, desc } from 'drizzle-orm';
import { differenceInDays, parse, subDays } from 'date-fns';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '@/db/drizzle';
import {
  accounts as accountsTable,
  categories as categoriesTable,
  transactions as transactionsTable,
} from '@/db/schema';
import {
  calculatePercentageChange,
  fillMissingDays,
} from '@/lib/utils';

const app = new Hono().get(
  '/',
  clerkMiddleware(),
  zValidator(
    'query',
    z.object({
      accountId: z.string().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    if (!auth) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const { accountId, from, to } = c.req.valid('query');
    const defaultEndDate = new Date();
    const defaultStartDate = subDays(defaultEndDate, 30);
    const endDate = to
      ? parse(to, 'yyyy-MM-dd', new Date())
      : defaultEndDate;
    const startDate = from
      ? parse(from, 'yyyy-MM-dd', new Date())
      : defaultStartDate;
    // Calculate the period length
    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodEnd = subDays(startDate, 1);
    const lastPeriodStart = subDays(lastPeriodEnd, periodLength - 1);

    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      const transactions = await db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          expenses:
            sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          remaining: sum(transactionsTable.amount).mapWith(Number),
        })
        .from(transactionsTable)
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id)
        )
        .where(
          and(
            accountId
              ? eq(transactionsTable.accountId, accountId)
              : undefined,
            eq(accountsTable.userId, userId),
            gte(transactionsTable.date, startDate),
            lte(transactionsTable.date, endDate)
          )
        );
      return transactions;
    }

    const [currentPeriod] = await fetchFinancialData(
      auth.userId!,
      startDate,
      endDate
    );
    const [lastPeriod] = await fetchFinancialData(
      auth.userId!,
      lastPeriodStart,
      lastPeriodEnd
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    const category = await db
      .select({
        name: categoriesTable.name,
        value:
          sql<number>`SUM(ABS(${transactionsTable.amount}))`.mapWith(
            Number
          ),
      })
      .from(transactionsTable)
      .innerJoin(
        accountsTable,
        eq(transactionsTable.accountId, accountsTable.id)
      )
      .innerJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      )
      .where(
        and(
          accountId
            ? eq(transactionsTable.accountId, accountId)
            : undefined,
          eq(accountsTable.userId, auth.userId!),
          lt(transactionsTable.amount, 0),
          gte(transactionsTable.date, startDate),
          lte(transactionsTable.date, endDate)
        )
      )
      .groupBy(categoriesTable.name)
      .orderBy(desc(sql`SUM(ABS(${transactionsTable.amount}))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce(
      (acc, curr) => acc + curr.value,
      0
    );
    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: 'Other',
        value: otherSum,
      });
    }

    const activeDays = await db
      .select({
        date: transactionsTable.date,
        income:
          sql<number>`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql<number>`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ABS(${transactionsTable.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
        remaining: sum(transactionsTable.amount).mapWith(Number),
      })
      .from(transactionsTable)
      .innerJoin(
        accountsTable,
        eq(transactionsTable.accountId, accountsTable.id)
      )
      .where(
        and(
          accountId
            ? eq(transactionsTable.accountId, accountId)
            : undefined,
          eq(accountsTable.userId, auth.userId!),
          gte(transactionsTable.date, startDate),
          lte(transactionsTable.date, endDate)
        )
      )
      .groupBy(transactionsTable.date)
      .orderBy(transactionsTable.date);

    const filledActiveDays = fillMissingDays(
      activeDays,
      startDate,
      endDate
    );

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days: filledActiveDays,
      },
    });
  }
);

export default app;
