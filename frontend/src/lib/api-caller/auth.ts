import z from 'zod';
import { throwIfError } from '.';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Username must be at least 1 characters.' }),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
});

export async function login(values: z.infer<typeof loginSchema>) {
    const response = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    throwIfError(response);
}
