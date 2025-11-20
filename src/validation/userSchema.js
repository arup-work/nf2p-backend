import {email, z} from 'zod';

export const registerSchema = z.object({
    name: z.string().max(255).min(4),
    email: z.email(),
    password: z.string().max(255).min(8)
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().max(255).min(8)
})