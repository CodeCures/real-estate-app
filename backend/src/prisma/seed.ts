import { UserRole, PropertyType, PropertyStatus, ExpenseType, RentalStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import prisma from '../lib/prisma';
import dotenv from 'dotenv';
import { hashPassword } from '../helpers/authHelpers';

dotenv.config();

const pickAtRandom = <T>(data: T[]): T => {
    return data[Math.floor(Math.random() * data.length)];
};

async function main() {
    console.log('Seeding database...');

    // 1. Seed Users
    const users = [];
    for (let i = 0; i < 5; i++) {
        const role = i === 0 ? UserRole.ADMIN : pickAtRandom([UserRole.INVESTOR, UserRole.LANDLORD, UserRole.TENANT]);
        users.push(
            prisma.user.create({
                data: {
                    email: faker.internet.email(),
                    name: faker.person.fullName(),
                    role,
                    password: await hashPassword('pass@123'),
                },
            }),
        );
    }
    const createdUsers = await Promise.all(users);
    console.log('✅ Users seeded');

    // 2. Seed Properties
    const properties = [];
    for (const user of createdUsers) {
        for (let i = 0; i < 3; i++) {
            const type = pickAtRandom([PropertyType.RESIDENTIAL, PropertyType.COMMERCIAL, PropertyType.INDUSTRIAL, PropertyType.LAND, PropertyType.MULTI_FAMILY, PropertyType.SINGLE_FAMILY]);
            const status = pickAtRandom([PropertyStatus.AVAILABLE, PropertyStatus.OCCUPIED, PropertyStatus.UNDER_RENOVATION, PropertyStatus.SOLD, PropertyStatus.PENDING]);
            const rentalStatus = pickAtRandom([RentalStatus.VACANT, RentalStatus.LEASED, RentalStatus.NOTICE_GIVEN]);
            properties.push(
                prisma.property.create({
                    data: {
                        userId: user.id,
                        name: faker.location.street(),
                        description: faker.lorem.sentence(),
                        type,
                        status,
                        address: faker.location.streetAddress(),
                        city: faker.location.city(),
                        state: faker.location.state(),
                        country: faker.location.country(),
                        zipCode: faker.location.zipCode(),
                        purchasePrice: faker.number.float({ min: 50000, max: 1000000, fractionDigits: 2 }),
                        currentValue: faker.number.float({ min: 50000, max: 1200000, fractionDigits: 2 }),
                        appreciationRate: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
                        rentalStatus,
                        monthlyRent: rentalStatus === RentalStatus.LEASED ? faker.number.float({ min: 500, max: 5000, fractionDigits: 2 }) : null,
                        purchaseDate: faker.date.past({ years: 10 }),
                    },
                }),
            );
        }
    }
    const createdProperties = await Promise.all(properties);
    console.log('✅ Properties seeded');

    // 3. Seed Expenses
    const expenses = [];
    for (const property of createdProperties) {
        for (let i = 0; i < 3; i++) {
            expenses.push(
                prisma.expense.create({
                    data: {
                        propertyId: property.id,
                        type: pickAtRandom([ExpenseType.MAINTENANCE, ExpenseType.REPAIR, ExpenseType.UTILITY, ExpenseType.TAX, ExpenseType.INSURANCE, ExpenseType.MORTGAGE, ExpenseType.MANAGEMENT_FEE, ExpenseType.MISCELLANEOUS]),
                        amount: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
                        date: faker.date.recent({ days: 30 }),
                        description: faker.lorem.words(5),
                        vendor: faker.company.name(),
                    },
                }),
            );
        }
    }
    await Promise.all(expenses);
    console.log('✅ Expenses seeded');

    // 4. Seed Maintenance Logs
    const maintenanceLogs = [];
    for (const property of createdProperties) {
        maintenanceLogs.push(
            prisma.maintenanceLog.create({
                data: {
                    propertyId: property.id,
                    description: faker.lorem.sentence(),
                    cost: faker.number.float({ min: 200, max: 5000, fractionDigits: 2 }),
                    date: faker.date.recent({ days: 60 }),
                    performedBy: faker.person.fullName(),
                },
            }),
        );
    }
    await Promise.all(maintenanceLogs);
    console.log('✅ Maintenance Logs seeded');

    // 5. Seed Rental Agreements
    const rentalAgreements = [];
    for (const property of createdProperties) {
        if (property.rentalStatus === RentalStatus.LEASED) {
            rentalAgreements.push(
                prisma.rentalAgreement.create({
                    data: {
                        propertyId: property.id,
                        tenantName: faker.person.fullName(),
                        startDate: faker.date.past({ years: 1 }),
                        endDate: faker.date.future({ years: 1 }),
                        monthlyRent: property.monthlyRent || faker.number.float({ min: 500, max: 5000, fractionDigits: 2 }),
                        securityDeposit: faker.number.float({ min: 1000, max: 5000, fractionDigits: 2 }),
                    },
                }),
            );
        }
    }
    await Promise.all(rentalAgreements);
    console.log('✅ Rental Agreements seeded');

    // 6. Seed Property Performance Reports
    const performanceReports = [];
    for (const property of createdProperties) {
        performanceReports.push(
            prisma.propertyPerformanceReport.create({
                data: {
                    propertyId: property.id,
                    totalRevenue: faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 }),
                    totalExpenses: faker.number.float({ min: 500, max: 30000, fractionDigits: 2 }),
                    netIncome: faker.number.float({ min: 100, max: 20000, fractionDigits: 2 }),
                    occupancyRate: faker.number.float({ min: 50, max: 100, fractionDigits: 2 }),
                    reportPeriod: faker.date.recent({ days: 90 }),
                },
            }),
        );
    }
    await Promise.all(performanceReports);
    console.log('✅ Property Performance Reports seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🌱 Seeding complete!');
    });
