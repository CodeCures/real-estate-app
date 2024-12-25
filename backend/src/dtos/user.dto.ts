import { User } from '@prisma/client';

export class UserDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
    }
}