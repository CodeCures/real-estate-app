import prisma from "../lib/prisma";

export class UserService {
    static async listUsers() {
        return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    }

    static async getUser(id: string) {
        await prisma.user.findFirst({ where: { id } })
    }

    static async updateUser(id: string, data: Record<string, any>) {
        return await prisma.user.update({ where: { id }, data })
    }

    static async deleteUser(id: string) {
        return await prisma.user.delete({ where: { id } })
    }
}