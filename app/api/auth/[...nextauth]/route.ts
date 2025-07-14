import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/Prisma';
import {PrismaAdapter} from '@auth/prisma-adapter'

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? "",
        }),
    ],
    callbacks: {
        session({ session, token, user }) {
            return session;
        }
    }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    if (req.query.nextauth?.includes("callback") && req.method === "POST") {
        console.log("logging custom data", req.body);
    }

    const cookieValue: string | undefined = req.cookies['content-type'];

    //method ovverride then edit
    const authOptionsNew: NextAuthOptions = {
        ...authOptions,
        callbacks: {
            ...authOptions.callbacks,
            session({ session, token, user }) {
                return {
                    ...session,
                    cookieValue: cookieValue
                };
            }
        }
    };

    return await NextAuth(req, res, authOptionsNew);
}
