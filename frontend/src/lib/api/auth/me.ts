import { bloodGroups, genders } from '.';
import { deserialize, fetchWrapper } from '..';

export type Role = 'member' | 'staff' | 'admin';

export interface Account {
    role: Role;
    email: string;
    name: string;
    phone: string;
    address: string;
    birthday: string;
    blood_group: (typeof bloodGroups)[number];
    gender: (typeof genders)[number];
    created_at: Date;
}

export const me = async (): Promise<Account> => {
    const response = await fetchWrapper('/auth/me');

    return deserialize(response);
};
