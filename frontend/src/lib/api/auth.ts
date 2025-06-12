import z from 'zod';
import { API_URL, fetchWrapper, throwIfError } from '.';
import { redirect } from 'next/navigation';

export const bloodGroups = [
    'o_plus',
    'o_minus',
    'a_plus',
    'a_minus',
    'b_plus',
    'b_minus',
    'a_b_plus',
    'a_b_minus',
] as const;
export const displayBloodGroup = (
    group: (typeof bloodGroups)[number],
): string => {
    switch (group) {
        case 'o_plus':
            return 'O+';
        case 'o_minus':
            return 'O-';
        case 'a_plus':
            return 'A+';
        case 'a_minus':
            return 'A-';
        case 'b_plus':
            return 'B+';
        case 'b_minus':
            return 'B-';
        case 'a_b_plus':
            return 'AB+';
        case 'a_b_minus':
            return 'AB-';
    }
};

export const genders = ['male', 'female'] as const;

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
    name: z.string().min(1, { message: 'Name must be provided.' }),
    phone: z
        .string()
        .regex(/0[\d]{9,9}/, { message: 'Phone must consist of 10 number' }),
    address: z.string().min(1, { message: 'Address must be provided.' }),
    birthday: z.string(),
    blood_group: z.enum(bloodGroups),
    gender: z.enum(genders),
});

export const register = async (values: z.infer<typeof registerSchema>) => {
    const response = await fetchWrapper('/auth/register', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

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
