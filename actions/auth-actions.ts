// src/actions/auth-actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validators"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/lib/auth"

export async function register(data: FormData) {
  const rawData = Object.fromEntries(data)
  const validated = registerSchema.parse(rawData)

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  })

  if (existingUser) {
    throw new Error("البريد الإلكتروني مستخدم بالفعل")
  }

  const hashedPassword = await bcrypt.hash(validated.password, 12)

  await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
    },
  })

  // Auto login after registration
  await signIn("credentials", {
    email: validated.email,
    password: validated.password,
    redirectTo: "/",
  })
}

export async function login(data: FormData) {
  const email = data.get("email") as string
  const password = data.get("password") as string

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  })
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/" })
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" })
}