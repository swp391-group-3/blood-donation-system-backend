import z from 'zod';
import { throwIfError } from '.';

export const schema = z.object({
    username: z
        .string()
        .min(1, { message: 'Username must be at least 1 characters.' }),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
});

export type Schema = typeof schema;

export async function login(values: Schema) {
    const response = await fetch(`${process.env.API_URL}/auth/login`);

    throwIfError(response);
}
