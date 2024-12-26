import 'next-auth';
import { DefaultSession } from 'next-auth';
import { User } from '.';

declare module 'next-auth' {
   

    interface Session {
        user: User & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends User{
        token: string;
    }
}