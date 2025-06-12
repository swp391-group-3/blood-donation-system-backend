import z from 'zod';
import { bloodGroups, genders } from '.';
import { fetchWrapper, throwIfError } from '..';

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
