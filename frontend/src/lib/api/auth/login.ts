import z from "zod";
import { fetchWrapper, throwIfError } from "..";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Username must be at least 1 characters.' }),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
});

export const login = async (values: z.infer<typeof loginSchema>) => {
    const response = await fetchWrapper('/auth/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

