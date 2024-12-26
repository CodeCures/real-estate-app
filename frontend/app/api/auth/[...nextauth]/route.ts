import { login } from '@/services/auth.service';
import { LoginPayload } from '@/types';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials

                const data = (await login({ email, password } as LoginPayload));
                const user = data.userData;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    accessToken: data.token
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            session.user.role = token.role as string;
            session.user.accessToken = token.accessToken as string;

            return session;
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/logout'
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
