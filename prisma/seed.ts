import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, BillingInterval } from '../src/generated/prisma/index.js'

const pool = new pg.Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding subscription plans...')

  await prisma.subscriptionPlan.upsert({
    where: { id: '7d105d9e-2eed-4c52-a76f-9fa5020fd81e' },
    update: {},
    create: {
      id: '7d105d9e-2eed-4c52-a76f-9fa5020fd81e',
      name: 'Trial',
      price: 0.00,
      createdAt: new Date('2026-03-27 13:09:13.133'),
      gatewayPlanId: null,
      billingInterval: BillingInterval.TRIAL,
      gatewayCustomerNotify: null,
      gatewayTotalCount: null,
      maxEmailsPerRun: 5,
      quota: 100
    }
  })

  await prisma.subscriptionPlan.upsert({
    where: { id: 'ab9eaabe-d7cb-4460-87f1-f015d7a51b14' },
    update: {},
    create: {
      id: 'ab9eaabe-d7cb-4460-87f1-f015d7a51b14',
      name: 'Plus Monthly',
      price: 299.00,
      createdAt: new Date('2026-03-27 13:09:13.123'),
      gatewayPlanId: 'plan_SVOe1j9q8LlXFR',
      billingInterval: BillingInterval.MONTH,
      gatewayCustomerNotify: 1,
      gatewayTotalCount: 12,
      maxEmailsPerRun: 12,
      quota: 1500
    }
  })

  await prisma.subscriptionPlan.upsert({
    where: { id: '1a473042-a5b2-4d46-b6db-130ebf4cbd5a' },
    update: {},
    create: {
      id: '1a473042-a5b2-4d46-b6db-130ebf4cbd5a',
      name: 'Pro Monthly',
      price: 999.00,
      createdAt: new Date('2026-03-27 13:09:13.129'),
      gatewayPlanId: 'plan_SVOgbZnyZO5ZIl',
      billingInterval: BillingInterval.MONTH,
      gatewayCustomerNotify: 1,
      gatewayTotalCount: 12,
      maxEmailsPerRun: 45,
      quota: 6000
    }
  })

  await prisma.subscriptionPlan.upsert({
    where: { id: '48690ddb-0201-48a0-8935-ce5f4543e851' },
    update: {},
    create: {
      id: '48690ddb-0201-48a0-8935-ce5f4543e851',
      name: 'Plus Yearly',
      price: 2999.00,
      createdAt: new Date('2026-03-27 13:09:13.126'),
      gatewayPlanId: 'plan_SVOedUl2j6rW8f',
      billingInterval: BillingInterval.YEAR,
      gatewayCustomerNotify: 1,
      gatewayTotalCount: 1,
      maxEmailsPerRun: 20,
      quota: 18000
    }
  })

  await prisma.subscriptionPlan.upsert({
    where: { id: '8f800440-5551-4ed1-9c50-dfe3aa93fe48' },
    update: {},
    create: {
      id: '8f800440-5551-4ed1-9c50-dfe3aa93fe48',
      name: 'Pro Yearly',
      price: 9999.00,
      createdAt: new Date('2026-03-27 13:09:13.131'),
      gatewayPlanId: 'plan_SVOh0lEXkM47Yk',
      billingInterval: BillingInterval.YEAR,
      gatewayCustomerNotify: 1,
      gatewayTotalCount: 1,
      maxEmailsPerRun: 75,
      quota: 72000
    }
  })

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
