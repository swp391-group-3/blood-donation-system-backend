import z from 'zod';
import { redirect } from 'next/navigation';
import { API_URL, fetchWrapper, throwIfError } from '..';
import { registerSchema } from './register';

export type Provider = 'google' | 'microsoft';

export const oauth2 = (provider: Provider) => {
    redirect(`${API_URL}/oauth2/${provider}`);
};

export const oauth2CompleteSchema = registerSchema.omit({
    email: true,
    password: true,
});

export const oauth2Complete = async (
    values: z.infer<typeof oauth2CompleteSchema>,
) => {
    const response = await fetchWrapper('/oauth2/complete', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};
