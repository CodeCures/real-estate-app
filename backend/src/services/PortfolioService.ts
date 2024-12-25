import { PortfolioRole, ActivityType, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { PortfolioMember } from '../types';
import { propertySelect } from '../helpers';

export class PortfolioService {

    static async createPortfolio(name: string, userId: string, members?: PortfolioMember[]) {
        const transaction = await prisma.$transaction(async (tx) => {

            let portfolio = await tx.portfolio.findFirst({
                where: { name },
            });


            if (!portfolio) {
                portfolio = await tx.portfolio.create({ data: { name } });
            }

            await tx.portfolioMember.upsert({
                where: {
                    portfolioId_userId: {
                        portfolioId: portfolio.id,
                        userId,
                    },
                },
                update: {
                    role: PortfolioRole.MANAGER,
                },
                create: {
                    portfolioId: portfolio.id,
                    userId,
                    role: PortfolioRole.MANAGER,
                },
            });

            // Step 4: Add additional members if provided
            if (members && members.length > 0) {
                for (const member of members) {
                    const user = await tx.user.findFirst({ where: { email: member.email } });

                    await tx.portfolioMember.upsert({
                        where: {
                            portfolioId_userId: {
                                portfolioId: portfolio.id,
                                userId: user.id,
                            },
                        },
                        update: {
                            role: member.role.toUpperCase() as PortfolioRole,
                        },
                        create: {
                            portfolioId: portfolio.id,
                            userId: user.id,
                            role: member.role.toUpperCase() as PortfolioRole,
                        },
                    });

                    // Optional: Send email invitation
                    // await sendInvitation(member, portfolio);
                }
            }


            await tx.portfolioActivity.create({
                data: {
                    portfolioId: portfolio.id,
                    userId,
                    actionType: 'PORTFOLIO_CREATED',
                    details: { name },
                },
            });

            return portfolio;
        });

        return transaction;
    }


    static async getUserPortfolios(userId: string) {
        return await prisma.portfolio.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                members: {
                    where: {
                        userId
                    },
                    select: {
                        role: true
                    }
                }
            }
        });
    }

    static async getPortfolioDetails(portfolioId: string, userId: string) {
        // Check access
        const member = await prisma.portfolioMember.findUnique({
            where: {
                portfolioId_userId: {
                    portfolioId,
                    userId
                }
            }
        });

        if (!member) {
            throw new Error('Access denied');
        }

        return await prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                properties: {
                    include: {
                        property: true
                    }
                },
                activities: {
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
    }

    static async updateMembers(
        portfolioId: string,
        userId: string,
        members: { userId: string; role: PortfolioRole; email?: string; isNew?: boolean }[]
    ) {
        // Check if user is manager
        const member = await prisma.portfolioMember.findUnique({
            where: {
                portfolioId_userId: {
                    portfolioId,
                    userId
                }
            }
        });

        if (member?.role !== PortfolioRole.MANAGER) {
            throw new Error('Only managers can update members');
        }

        await prisma.$transaction(async (tx) => {
            // Remove existing members except the manager
            await tx.portfolioMember.deleteMany({
                where: {
                    portfolioId,
                    userId: {
                        not: userId
                    }
                }
            });

            // Add new members
            for (const member of members) {
                await tx.portfolioMember.create({
                    data: {
                        portfolioId,
                        userId: member.userId,
                        role: member.role
                    }
                });

                // if (member.isNew && member.email) {
                //     await this.sendInvitation(member.email, portfolioId, userId);
                // }
            }

            // Log activity
            await this.logActivity(tx, {
                portfolioId,
                userId,
                actionType: ActivityType.MEMBERS_UPDATED,
                details: { members }
            });
        });

        // Broadcast update
        // this.broadcastUpdate(portfolioId, 'MEMBERS_UPDATED', { members });
    }

    static async addProperties(portfolioId: string, userId: string, propertyIds: string[]) {
        // Check permissions
        const member = await prisma.portfolioMember.findUnique({
            where: {
                portfolioId_userId: {
                    portfolioId,
                    userId
                }
            }
        });

        if (!member || ![PortfolioRole.MANAGER, PortfolioRole.CONTRIBUTOR].includes(member.role as any)) {
            throw new Error('Insufficient permissions');
        }

        await prisma.$transaction(async (tx) => {
            // Add properties
            await tx.portfolioProperty.createMany({
                data: propertyIds.map(propertyId => ({
                    portfolioId,
                    propertyId
                })),
                skipDuplicates: true
            });

            // Log activity
            await this.logActivity(tx, {
                portfolioId,
                userId,
                actionType: ActivityType.PROPERTIES_ADDED,
                details: { propertyIds }
            });
        });

        // Broadcast update
        // broadcastUpdate(portfolioId, 'PROPERTIES_ADDED', { propertyIds });
    }

    static async getActivities(
        portfolioId: string,
        userId: string,
        page: number = 1,
        limit: number = 20
    ) {
        // Check access
        const member = await prisma.portfolioMember.findUnique({
            where: {
                portfolioId_userId: {
                    portfolioId,
                    userId
                }
            }
        });

        if (!member) {
            throw new Error('Access denied');
        }

        return await prisma.portfolioActivity.findMany({
            where: {
                portfolioId
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (page - 1) * limit,
            take: limit
        });
    }


    static async getProperties(
        portfolioId: string,
        userId: string,
        page: number = 1,
        limit: number = 20
    ) {
        // Check if the user is a member of the portfolio
        const member = await prisma.portfolioMember.findUnique({
            where: {
                portfolioId_userId: {
                    portfolioId,
                    userId,
                },
            },
        });

        if (!member) {
            throw new Error('Access denied');
        }

        // Retrieve portfolio properties
        return await prisma.portfolioProperty.findMany({
            where: {
                portfolioId,
            },
            include: {
                property: {
                    select: propertySelect,
                },
            },
            orderBy: {
                addedAt: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }



    private static async logActivity(
        tx: Prisma.TransactionClient,
        data: {
            portfolioId: string;
            userId: string;
            actionType: ActivityType;
            details?: any;
        }
    ) {
        return await tx.portfolioActivity.create({ data });
    }
}