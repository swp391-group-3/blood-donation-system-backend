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

export async function google() {
    redirect(`${API_URL}/auth/google`);
}

export async function microsoft() {
    redirect(`${API_URL}/auth/microsoft`);
}
