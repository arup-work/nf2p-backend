import { email, z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().max(255).min(4),
    lastName: z.string().max(255).min(4),
    email: z.email(),
    password: z.string().max(255).min(8)
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().max(255).min(8)
})

export const forgotPasswordSchema = z.object({
    email: z.email(),
})

export const resetPasswordSchema = z.object({
    password: z.string().max(255).min(8)
})


export const updateProfileSchema = z.object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
})

export const updatePasswordChangeSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
})