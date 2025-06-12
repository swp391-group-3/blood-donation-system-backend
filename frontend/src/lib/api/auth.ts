import z from 'zod';
import { API_URL, fetchWrapper, throwIfError } from '.';
import { redirect } from 'next/navigation';

export const blood_groups = [
    'o_plus',
    'o_minus',
    'a_plus',
    'a_minus',
    'b_plus',
    'b_minus',
    'a_b_plus',
    'a_b_minus',
] as const;
export const blood_groups_with_label = [
    {
        label: 'O+',
        value: 'o_plus',
    },

    {
        label: 'O-',
        value: 'o_minus',
    },
    {
        label: 'A+',
        value: 'a_plus',
    },
    {
        label: 'A-',
        value: 'a_minus',
    },
    {
        label: 'B+',
        value: 'b_plus',
    },
    {
        label: 'B-',
        value: 'b_minus',
    },
    {
        label: 'AB+',
        value: 'a_b_plus',
    },
    {
        label: 'AB-',
        value: 'a_b_minus',
    },
];

export const genders = ['male', 'female'] as const;
export const gender_with_labels = genders.map((gender) => ({
    label: gender,
    value: gender,
}));

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
    phone: z
        .string()
        .regex(/0[\d]{9,9}/, { message: 'Phone must consist of 10 number' }),
    address: z.string().min(1, { message: 'Address must be provided.' }),
    birthday: z.date().refine((date) => date.getTime() < Date.now(), {
        message: 'Date must be in the past',
    }),
    blood_group: z.enum(blood_groups),
    gender: z.enum(genders),
});

export const register = async (values: z.infer<typeof registerSchema>) => {
    const response = await fetchWrapper('auth/register', {
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
    const response = await fetchWrapper('auth/login', {
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
