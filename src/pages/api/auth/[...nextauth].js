// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_WRITE_TOKEN,
});

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const user = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email });

        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);
          if (isValidPassword) {
            return user;
          } else {
            throw new Error("Invalid password");
          }
        } else {
          throw new Error("User not found");
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        const userDoc = await sanityClient.fetch(`*[_type == "usuario" && email == $email][0]`, { email: user.email });
        if (!userDoc) {
          const newUser = await sanityClient.create({
            _type: 'usuario',
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google',
            providerAccountId: account.providerAccountId,
            createdAt: new Date().toISOString(),
          })
          return true;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url;
    },
    async session({ session, token }) {
      // Obtener información adicional del usuario desde Sanity, como los paquetes adquiridos
      if (token.id) {
        const userData = await sanityClient.fetch(`*[_type == "usuario" && email == $userEmail][0]`, { userEmail: session.user.email });
        // Asegúrate de que paquetesAdquiridos existe en userData
        session.user.paquetesAdquiridos = userData?.paquetesAdquiridos || [];
        console.log(userData);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
