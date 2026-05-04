// src/lib/validators.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  compareAt: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  images: z.array(z.string()).min(1, "يجب إضافة صورة واحدة على الأقل"),
})

export const addressSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  zipCode: z.string().min(3),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10).optional(),
})

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive(),
  minPurchase: z.coerce.number().positive().optional(),
  maxDiscount: z.coerce.number().positive().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CouponInput = z.infer<typeof couponSchema>