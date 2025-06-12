'use client';

import z from 'zod';
import { API_URL, fetchWrapper, throwIfError } from '.';
import { redirect } from 'next/navigation';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Username must be at least 1 characters.' }),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
});

export async function login(values: z.infer<typeof loginSchema>) {
    const response = await fetchWrapper('auth/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
}

export type Provider = 'google' | 'microsoft';

export async function oauth2(provider: Provider) {
    redirect(`${API_URL}/oauth2/${provider}`);
}
