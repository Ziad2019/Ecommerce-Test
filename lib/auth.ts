// lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { loginSchema } from "./validators"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Credentials({
      async authorize(credentials) {
        try {
          const validated = loginSchema.safeParse(credentials)
          if (!validated.success) return null

          const { email, password } = validated.data
          const user = await prisma.user.findUnique({ where: { email } })

          if (!user || !user.password) return null

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch {
          return null
        }
      },
    }),
  ],
})